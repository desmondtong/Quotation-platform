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
      "SELECT * FROM quotations WHERE supplier_id = ? AND is_deleted = 0",
      [req.params.supplier_id]
    );

    for (const item of quotation as RequestBody[]) {
      const [items] = await pool.query(
        "SELECT * FROM qt_items WHERE quotation_id = ?",
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

const getAllProjects = async (req: Request, res: Response) => {
  try {
    const [project] = await pool.query(
      "SELECT * FROM projects WHERE is_active = true"
    );

    for (const item of project as RequestBody[]) {
      const [items] = await pool.query(
        "SELECT * FROM items WHERE project_id = ?",
        [item.project_id]
      );
      item["items"] = items as RequestBody[];
    }

    res.status(201).json({ status: "ok", msg: project });
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const getProjectById = async (req: Request, res: Response) => {
  try {
    const [project] = await pool.query(
      "SELECT * FROM projects WHERE project_id = ?",
      [req.params.project_id]
    );
    const projectData = (project as RequestBody[])[0];

    const [items] = await pool.query(
      "SELECT * FROM items WHERE project_id = ?",
      [projectData.project_id]
    );
    projectData["items"] = items as RequestBody[];

    res.status(201).json({ status: "ok", msg: projectData });
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const deleteProject = async (req: Request, res: Response) => {
  try {
    try {
      // start transaction to delete project and items
      await pool.query("START TRANSACTION");

      // delete project by update is_deleted and is_active
      await pool.query(
        `UPDATE projects SET is_deleted = 1, is_active = 0
        WHERE project_id = ?
        `,
        [req.params.project_id]
      );

      // delete items by update is_deleted
      await pool.query(
        `UPDATE items SET is_deleted =1 
        WHERE project_id = ?`,
        [req.params.project_id]
      );

      await pool.query("COMMIT");
      res.status(201).json({ status: "ok", msg: "Project deleted" });
    } catch (error: any) {
      await pool.query("ROLLBACK");

      console.error(error.message);
      res.status(500).json({
        status: "error",
        error: "Rollback: Error in deleting project",
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const updateProject = async (req: Request, res: Response) => {
  try {
    const { project_name, is_active, items }: RequestBody = req.body;

    try {
      // start transaction to update project and items
      await pool.query("START TRANSACTION");

      // update project
      if ("project_name" in req.body) {
        await pool.query(
          `UPDATE projects SET project_name = ?
              WHERE project_id = ?
              `,
          [project_name, req.params.project_id]
        );
      }

      if ("is_active" in req.body) {
        await pool.query(
          `UPDATE projects SET is_active = ?
              WHERE project_id = ?
              `,
          [is_active, req.params.project_id]
        );
      }

      // update items
      if ("items" in req.body)
        for (const item of items!) {
          if ("technology" in item) {
            await pool.query(
              `UPDATE items SET technology = ?
                  WHERE item_id = ?
                  `,
              [item.technology, item.item_id]
            );
          }
          if ("material" in item) {
            await pool.query(
              `UPDATE items SET material = ?
                  WHERE item_id = ?
                  `,
              [item.material, item.item_id]
            );
          }
          if ("surface_finish" in item) {
            await pool.query(
              `UPDATE items SET surface_finish = ?
                  WHERE item_id = ?
                  `,
              [item.surface_finish, item.item_id]
            );
          }
          if ("item_name" in item) {
            await pool.query(
              `UPDATE items SET item_name = ?
                  WHERE item_id = ?
                  `,
              [item.item_name, item.item_id]
            );
          }
          if ("quantity" in item) {
            await pool.query(
              `UPDATE items SET quantity = ?
                  WHERE item_id = ?
                  `,
              [item.quantity, item.item_id]
            );
          }
          if ("status" in item) {
            await pool.query(
              `UPDATE items SET status = ?
                  WHERE item_id = ?
                  `,
              [item.status, item.item_id]
            );
          }
        }

      await pool.query("COMMIT");
      res.status(201).json({ status: "ok", msg: "Project updated" });
    } catch (error: any) {
      await pool.query("ROLLBACK");

      console.error(error.message);
      res.status(500).json({
        status: "error",
        error: "Rollback: Error in updating project",
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const deleteItem = async (req: Request, res: Response) => {
  try {
    // delete items by update is_deleted
    await pool.query(
      `UPDATE items SET is_deleted =1 
            WHERE item_id = ?`,
      [req.params.item_id]
    );

    res.status(201).json({ status: "ok", msg: "Item deleted" });
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

export {
  createQuotation,
  getAllSupplierQuotations
};
