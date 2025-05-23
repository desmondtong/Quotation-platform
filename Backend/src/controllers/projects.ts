import { Request, Response } from "express";
import pool from "../db/db";
import { RequestBody } from "../interfaces";

const createProject = async (req: Request, res: Response) => {
  try {
    const { customer_id, project_name, items }: RequestBody = req.body;

    try {
      // transaction to create new project + items
      await pool.query("START TRANSACTION");

      // create new project and get new project_id
      await pool.query(
        "INSERT INTO projects (customer_id, project_name) VALUES (?, ?)",
        [customer_id, project_name]
      );
      const [last_id] = await pool.query("SELECT LAST_INSERT_ID()");
      const project_id = (last_id as RequestBody[])[0]["LAST_INSERT_ID()"];

      // loop through items to create new items within project
      for (const item of items!) {
        await pool.query(
          `INSERT INTO items (project_id, technology, material, surface_finish, item_name, quantity) 
            VALUES (?, ?, ?, ?, ?, ?)`,
          [
            project_id,
            item.technology,
            item.material,
            item.surface_finish,
            item.item_name,
            item.quantity,
          ]
        );
      }

      await pool.query("COMMIT");
      res.status(201).json({ status: "ok", msg: project_id });
    } catch (error: any) {
      await pool.query("ROLLBACK");

      console.error(error.message);
      res.status(500).json({
        status: "error",
        error: "Rollback: Error in creating project",
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const getAllCustomerProjects = async (req: Request, res: Response) => {
  try {
    const [project] = await pool.query(
      "SELECT * FROM projects WHERE customer_id = ? AND is_deleted = 0",
      [req.params.customer_id]
    );

    for (const item of project as RequestBody[]) {
      const [items] = await pool.query(
        "SELECT * FROM items WHERE project_id = ? AND is_deleted = 0",
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

const getAllProjects = async (req: Request, res: Response) => {
  try {
    const [project] = await pool.query(
      `SELECT p.*,
      company AS customer_company
      FROM projects p
      JOIN users u ON u.user_id = p.customer_id 
      WHERE is_active = 1`
    );

    for (const item of project as RequestBody[]) {
      const [items] = await pool.query(
        `SELECT * FROM items 
        WHERE project_id = ? AND is_deleted = 0 AND (status = ? OR status = ?)`,
        [item.project_id, "NO OFFER", "OFFERED"]
      );
      item["items"] = items as RequestBody[];
    }
    console.log(project);

    res.status(201).json({ status: "ok", msg: project });
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const getProjectById = async (req: Request, res: Response) => {
  try {
    const [project] = await pool.query(
      `SELECT
      p.*,
      name AS customer_name, company AS customer_company, email AS customer_email, phone_number AS customer_phone_number
      FROM projects p
      JOIN users u ON p.customer_id = u.user_id 
      WHERE project_id = ?`,
      [req.params.project_id]
    );
    const projectData = (project as RequestBody[])[0];

    const [items] = await pool.query(
      "SELECT * FROM items WHERE project_id = ? AND is_deleted = 0",
      [projectData.project_id]
    );
    projectData["items"] = items as RequestBody[];

    res.status(201).json({ status: "ok", msg: projectData });
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const getProjectByIdSupplier = async (req: Request, res: Response) => {
  try {
    const [project] = await pool.query(
      `SELECT
      p.*,
      name AS customer_name, company AS customer_company, email AS customer_email, phone_number AS customer_phone_number
      FROM projects p
      JOIN users u ON p.customer_id = u.user_id 
      WHERE project_id = ?`,
      [req.params.project_id]
    );
    const projectData = (project as RequestBody[])[0];

    const [items] = await pool.query(
      `SELECT * FROM items 
      WHERE project_id = ? AND is_deleted = 0 AND (status = ? OR status = ?)`,
      [projectData.project_id, "NO OFFER", "OFFERED"]
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
        `UPDATE items SET is_deleted = 1 
        WHERE project_id = ? AND is_deleted = 0`,
        [req.params.project_id]
      );

      // update all related quotation status to DECLINED
      await pool.query(
        `UPDATE quotations SET status = ?
          WHERE project_id = ? AND is_deleted = 0`,
        ["DECLINED", req.params.project_id]
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

      // if all items' status are QUOTE ACCEPTED or COMPLETED, set project as inactive
      const [item_status] = await pool.query(
        `
        SELECT COUNT(STATUS) FROM items 
        WHERE project_id = ? AND (status = ? OR status = ?) AND is_deleted = 0
        `,
        [req.params.project_id, "NO OFFER", "OFFERED"]
      );

      if ((item_status as RequestBody[])[0]["COUNT(STATUS)"] == 0)
        await pool.query(
          `
          UPDATE projects SET is_active = 0
          WHERE project_id = ?
          `,
          [req.params.project_id]
        );

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
  createProject,
  getAllCustomerProjects,
  getAllProjects,
  getProjectById,
  getProjectByIdSupplier,
  deleteProject,
  updateProject,
  deleteItem,
};
