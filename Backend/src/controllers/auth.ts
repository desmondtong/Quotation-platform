import { Request, Response } from "express";
import pool from "../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { RequestBody } from "../interfaces";

const register = async (req: Request, res: Response) => {
  try {
    const { name, company, email, password, phone_number, role }: RequestBody =
      req.body;

    // check if email used is already in db
    const [auth] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if ((auth as RequestBody[]).length) {
      return res.status(400).json({ msg: "Duplicate email" });
    }

    // proceed to hash password and register user if email does not exist
    const hash = await bcrypt.hash(password!, 5);
    await pool.query(
      "INSERT INTO users (name, company, email, password, phone_number, role) VALUES (?, ?, ?, ?, ?, ?)",
      [name, company, email, hash, phone_number, role]
    );

    const [last_id] = await pool.query("SELECT LAST_INSERT_ID()");
    const user_id = (last_id as RequestBody[])[0]["LAST_INSERT_ID()"];

    // create claims for direct login after registration
    const claims: RequestBody = {
      user_id,
      email,
      name,
      company,
      role,
      phone_number,
    };

    const access = jwt.sign(claims, String(process.env.ACCESS_SECRET), {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.status(201).json({ msg: "User created", access });
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: RequestBody = req.body;

    // check if account exist
    const [auth] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);

    if (!(auth as RequestBody[]).length) {
      return res.status(400).json({
        status: "error",
        msg: "You do not have an account. Please register",
      });
    }

    // decrypt and compare password
    const data = (auth as RequestBody[])[0];
    const result = await bcrypt.compare(password!, data.password!);

    if (!result) {
      console.log("email or password error");
      return res.status(401).json({ status: "error", msg: "Login failed" });
    }

    // create claims
    const claims: RequestBody = {
      user_id: data.user_id,
      email: data.email,
      name: data.name,
      company: data.company,
      role: data.role,
      phone_number: data.phone_number,
    };

    const access = jwt.sign(claims, String(process.env.ACCESS_SECRET), {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });
    // const refresh = jwt.sign(claims, String(process.env.REFRESH_SECRET), {
    //   expiresIn: "30d",
    //   jwtid: uuidv4(),
    // });

    res.json({ access });
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "Login failed" });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const [userAcc] = await pool.query(
      "SELECT * FROM users WHERE user_id = ?",
      [req.params.user_id]
    );

    res.json((userAcc as RequestBody[])[0]);
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "Get user failed" });
  }
};

export { register, login, getUserById };
