import { Request, Response } from "express";
import pool from "../db/db";

const getRoles = async (req: Request, res: Response) => {
  try {
    const [getAll] = await pool.query("SELECT * FROM roles");

    const roles = (getAll as Array<any>).map((item) => item.role);

    res.status(201).json(roles);
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Get roles failed" });
  }
};

const getItemStatuses = async (req: Request, res: Response) => {
  try {
    const [getAll] = await pool.query("SELECT * FROM item_statuses");

    const statuses = (getAll as Array<any>).map((item) => item.status);

    res.status(201).json(statuses);
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Get item statuses failed" });
  }
};

const getQtStatuses = async (req: Request, res: Response) => {
  try {
    const [getAll] = await pool.query("SELECT * FROM qt_statuses");

    const statuses = (getAll as Array<any>).map((item) => item.status);

    res.status(201).json(statuses);
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Get quotation statuses failed" });
  }
};

const getTechnologies = async (req: Request, res: Response) => {
  try {
    const [getAll] = await pool.query("SELECT * FROM technologies");

    const technologies = (getAll as Array<any>).map((item) => item.technology);

    res.status(201).json(technologies);
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Get technologies failed" });
  }
};

const getMaterials = async (req: Request, res: Response) => {
  try {
    const [getAll] = await pool.query("SELECT * FROM materials");

    const materials = (getAll as Array<any>).map((item) => item.material);

    res.status(201).json(materials);
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Get materials failed" });
  }
};

const getSurfaceFinishes = async (req: Request, res: Response) => {
  try {
    const [getAll] = await pool.query("SELECT * FROM surface_finishes");

    const finishes = (getAll as Array<any>).map((item) => item.surface_finish);

    res.status(201).json(finishes);
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Get surface finishes failed" });
  }
};

export {
  getRoles,
  getItemStatuses,
  getQtStatuses,
  getMaterials,
  getSurfaceFinishes,
  getTechnologies,
};
