import { Request, Response } from "express";
import pool from "../db/db";
import { RequestBody } from "../interfaces";

const createQuotation = async (req: Request, res: Response) => {
  try {
    const { supplier_id, project_id, qt_items }: RequestBody = req.body;

    try {
      // transaction to create new quotation + qt_items
      await pool.query("START TRANSACTION");

      // create new quotation and get new quotation_id
      await pool.query(
        "INSERT INTO quotations (supplier_id, project_id) VALUES (?, ?)",
        [supplier_id, project_id]
      );
      const [last_id] = await pool.query("SELECT LAST_INSERT_ID()");
      const quotation_id = (last_id as RequestBody[])[0]["LAST_INSERT_ID()"];

      // loop through qt_items to create new qt_items within quotation
      for (const item of qt_items!) {
        await pool.query(
          `INSERT INTO qt_items (quotation_id, technology, material, surface_finish, item_name, quantity, unit_price)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            quotation_id,
            item.technology,
            item.material,
            item.surface_finish,
            item.item_name,
            item.quantity,
            item.unit_price,
          ]
        );
      }

      // calculate total price of quotation and update
      const [sum] = await pool.query(
        `SELECT SUM(price) FROM qt_items qt
        JOIN quotations q ON q.quotation_id = qt.quotation_id
        WHERE qt.is_deleted = 0 AND q.quotation_id = ?`,
        [quotation_id]
      );

      const total_price = (sum as RequestBody[])[0]["SUM(price)"];

      await pool.query(
        `UPDATE quotations SET total_price = ?
        WHERE quotation_id = ?`,
        [total_price, quotation_id]
      );

      await pool.query("COMMIT");
      res.status(201).json({ status: "ok", msg: "Quotation created" });
    } catch (error: any) {
      await pool.query("ROLLBACK");

      console.error(error.message);
      res.status(500).json({
        status: "error",
        error: "Rollback: Error in creating quotation",
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const getAllSupplierQuotations = async (req: Request, res: Response) => {
  try {
    const [quotation] = await pool.query(
      `SELECT 
      quotation_id, supplier_id, total_price, qt.datetime AS qt_datetime, status AS qt_status,
      
      u.name AS supplier_name, u.company AS supplier_company, u.email AS supplier_email, u.phone_number AS supplier_phone_number, 

      project_name, p.project_id, p.datetime AS project_datetime
      
      FROM quotations qt
      JOIN projects p ON p.project_id = qt.project_id
      JOIN users u ON qt.supplier_id = u.user_id
      WHERE qt.supplier_id = ? AND qt.is_deleted = 0`,
      [req.params.supplier_id]
    );

    for (const item of quotation as RequestBody[]) {
      const [items] = await pool.query(
        "SELECT * FROM qt_items WHERE quotation_id = ? AND is_deleted = 0",
        [item.quotation_id]
      );
      item["qt_items"] = items as RequestBody[];
    }

    res.status(201).json({ status: "ok", msg: quotation });
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const getQuotationsByItemId = async (req: Request, res: Response) => {
  try {
    console.log("here");
    const { item_id }: RequestBody = req.body;

    const [quotation] = await pool.query(
      `SELECT qt.*, u.company, q.status FROM qt_items qt
      JOIN quotations q ON qt.quotation_id = q.quotation_id
      JOIN users u ON q.supplier_id = u.user_id
      WHERE item_id = ? AND qt.is_deleted = 0`,
      [item_id]
    );

    res.status(201).json({ status: "ok", msg: quotation });
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const getQuotationsByCustomerId = async (req: Request, res: Response) => {
  try {
    const { customer_id }: RequestBody = req.body;

    const [quotation] = await pool.query(
      `SELECT 
      quotation_id, supplier_id, total_price, qt.datetime AS qt_datetime, status AS qt_status,
      
      u.name AS supplier_name, u.company AS supplier_company, u.email AS supplier_email, u.phone_number AS supplier_phone_number, 

      project_name, p.project_id, p.datetime AS project_datetime
      
      FROM quotations qt
      JOIN projects p ON p.project_id = qt.project_id
      JOIN users u ON qt.supplier_id = u.user_id
      WHERE p.customer_id = ? AND qt.is_deleted = 0 AND p.is_deleted = 0`,
      [customer_id]
    );

    for (const item of quotation as RequestBody[]) {
      const [items] = await pool.query(
        "SELECT * FROM qt_items WHERE quotation_id = ? AND is_deleted = 0",
        [item.quotation_id]
      );
      item["qt_items"] = items as RequestBody[];
    }

    res.status(201).json({ status: "ok", msg: quotation });
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const getQuotationsByQuotationId = async (req: Request, res: Response) => {
  try {
    const { quotation_id }: RequestBody = req.body;

    const [quotation] = await pool.query(
      `SELECT 
      quotation_id, supplier_id, total_price, qt.datetime AS qt_datetime, status AS qt_status,
      
      u.name AS supplier_name, u.company AS supplier_company, u.email AS supplier_email, u.phone_number AS supplier_phone_number, 

      project_name, p.project_id, p.datetime AS project_datetime
      
      FROM quotations qt
      JOIN projects p ON p.project_id = qt.project_id
      JOIN users u ON qt.supplier_id = u.user_id
      WHERE qt.quotation_id = ? AND qt.is_deleted = 0 AND p.is_deleted = 0`,
      [quotation_id]
    );

    const quotationData = (quotation as RequestBody[])[0];

    const [items] = await pool.query(
      `SELECT 
      qt.qt_item_id, qt.quotation_id, qt.technology AS qt_technology, qt.material AS qt_material, qt.surface_finish AS qt_surface_finish, qt.item_name AS qt_item_name, qt.quantity AS qt_quantity, qt.unit_price AS qt_unit_price, qt.price AS qt_price, qt.is_deleted AS qt_is_deleted,
      
      i.item_id, i.project_id, i.status, i.technology, i.material, i.surface_finish, i.item_name, i.quantity, i.is_deleted
      FROM qt_items qt
      JOIN items i ON qt.item_id = i.item_id  
      WHERE qt.quotation_id = ? AND qt.is_deleted = 0`,
      [quotation_id]
    );
    quotationData["qt_items"] = (items as RequestBody[])[0] as RequestBody[];

    res.status(201).json({ status: "ok", msg: quotationData });
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const deleteQuotation = async (req: Request, res: Response) => {
  try {
    try {
      // start transaction to delete quotation and qt_items
      await pool.query("START TRANSACTION");

      // delete quotation by update is_deleted
      await pool.query(
        `UPDATE quotations SET is_deleted = 1
        WHERE quotation_id = ?
        `,
        [req.params.quotation_id]
      );

      // delete items by update is_deleted
      await pool.query(
        `UPDATE qt_items SET is_deleted = 1 
        WHERE quotation_id = ? AND is_deleted = 0`,
        [req.params.quotation_id]
      );

      await pool.query("COMMIT");
      res.status(201).json({ status: "ok", msg: "Quotation deleted" });
    } catch (error: any) {
      await pool.query("ROLLBACK");

      console.error(error.message);
      res.status(500).json({
        status: "error",
        error: "Rollback: Error in deleting quotation",
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const updateQuotation = async (req: Request, res: Response) => {
  try {
    const { status, qt_items }: RequestBody = req.body;

    try {
      // start transaction to update quotation and qt_items
      await pool.query("START TRANSACTION");

      // update quotation
      if ("status" in req.body) {
        await pool.query(
          `UPDATE quotations SET status = ?
              WHERE quotation_id = ?
              `,
          [status, req.params.quotation_id]
        );
      }

      // update qt_items
      if ("qt_items" in req.body)
        for (const item of qt_items!) {
          if ("technology" in item) {
            await pool.query(
              `UPDATE qt_items SET technology = ?
                  WHERE qt_item_id = ?
                  `,
              [item.technology, item.qt_item_id]
            );
          }
          if ("material" in item) {
            await pool.query(
              `UPDATE qt_items SET material = ?
                  WHERE qt_item_id = ?
                  `,
              [item.material, item.qt_item_id]
            );
          }
          if ("surface_finish" in item) {
            await pool.query(
              `UPDATE qt_items SET surface_finish = ?
                  WHERE qt_item_id = ?
                  `,
              [item.surface_finish, item.qt_item_id]
            );
          }
          if ("item_name" in item) {
            await pool.query(
              `UPDATE qt_items SET item_name = ?
                  WHERE qt_item_id = ?
                  `,
              [item.item_name, item.qt_item_id]
            );
          }
          if ("quantity" in item) {
            await pool.query(
              `UPDATE qt_items SET quantity = ?
                  WHERE qt_item_id = ?
                  `,
              [item.quantity, item.qt_item_id]
            );
            // "price" column will auto update in qt_items table
          }
          if ("unit_price" in item) {
            await pool.query(
              `UPDATE qt_items SET unit_price = ?
                WHERE qt_item_id = ?
                `,
              [item.unit_price, item.qt_item_id]
            );
            // "price" column will auto update in qt_items table
          }
        }

      await pool.query("COMMIT");
      res.status(201).json({ status: "ok", msg: "Quotation updated" });
    } catch (error: any) {
      await pool.query("ROLLBACK");

      console.error(error.message);
      res.status(500).json({
        status: "error",
        error: "Rollback: Error in updating quotation",
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const deleteQtItem = async (req: Request, res: Response) => {
  try {
    try {
      await pool.query("START TRANSACTION");

      // delete qt_item by update is_deleted
      await pool.query(
        `UPDATE qt_items SET is_deleted =1 
              WHERE qt_item_id = ?`,
        [req.params.qt_item_id]
      );

      // get quotation_id of the deleted qt_item
      const [id] = await pool.query(
        "SELECT quotation_id FROM qt_items WHERE qt_item_id = ?",
        [req.params.qt_item_id]
      );
      const quotation_id = (id as RequestBody[])[0]["quotation_id"];

      // re-calculate total price of quotation and update
      const [sum] = await pool.query(
        `SELECT SUM(price) FROM qt_items qt
              JOIN quotations q ON q.quotation_id = qt.quotation_id
              WHERE qt.is_deleted = 0 AND q.quotation_id = ?`,
        [quotation_id]
      );

      const total_price = (sum as RequestBody[])[0]["SUM(price)"];

      await pool.query(
        `UPDATE quotations SET total_price = ?
              WHERE quotation_id = ?`,
        [total_price, quotation_id]
      );

      res.status(201).json({ status: "ok", msg: "Item deleted" });

      await pool.query("COMMIT");
    } catch (error: any) {
      await pool.query("ROLLBACK");

      console.error(error.message);
      res.status(500).json({
        status: "error",
        error: "Rollback: Error in deleting quoted item",
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

export {
  createQuotation,
  getAllSupplierQuotations,
  getQuotationsByItemId,
  getQuotationsByCustomerId,
  getQuotationsByQuotationId,
  deleteQuotation,
  updateQuotation,
  deleteQtItem,
};
