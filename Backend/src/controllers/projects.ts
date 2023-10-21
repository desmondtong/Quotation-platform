import { Request, Response } from "express";
import pool from "../db/db";
import { RequestBody } from "../interfaces";

const createProject = async (req: Request, res: Response) => {
  try {
    const { customer_id, project_name, items }: RequestBody = req.body;

    // transaction to create new project + items
    try {
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
      res.status(201).json({ status: "ok", msg: "Project created" });
    } catch (error: any) {
      await pool.query("ROLLBACK");

      console.error(error.message);
      res
        .status(500)
        .json({
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
      "SELECT * FROM projects WHERE customer_id = ?",
      [req.params.customer_id]
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

export { createProject, getAllCustomerProjects };
