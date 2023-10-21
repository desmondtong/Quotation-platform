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
    const auth = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if ((auth[0] as Array<any>).length) {
      return res.status(400).json({ msg: "Duplicate email" });
    }

    // proceed to hash password and register user if email does not exist
    const hash = await bcrypt.hash(password!, 5);
    const addAuth = await pool.query(
      "INSERT INTO users (name, company, email, password, phone_number, role) VALUES (?, ?, ?, ?, ?, ?)",
      [name, company, email, hash, phone_number, role]
    );

    res.status(201).json({ msg: "User created" });
  } catch (error: any) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: RequestBody = req.body;

    // check if account exist
    const auth = await pool.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);

    if (!auth.rowCount) {
      return res.status(400).json({
        status: "error",
        msg: "You do not have an account. Please register",
      });
    }

    // // decrypt and compare password
    // const result = await bcrypt.compare(password, auth.rows[0].password);

    // if (!result) {
    //   console.log("email or password error");
    //   return res.status(401).json({ status: "error", msg: "Login failed" });
    // }

    // // create claims
    // const claims: {
    //   email: String;
    //   id: Number;
    //   role: String;
    //   cart_id?: String;
    //   first_name?: String;
    //   last_name?: String;
    //   address?: String;
    //   postal_code?: String;
    //   store_name?: String;
    //   category?: String;
    //   contact?: Number;
    //   description?: String;
    // } = {
    //   email: auth.rows[0].email,
    //   id: auth.rows[0].uuid,
    //   role: auth.rows[0].role,
    //   contact: auth.rows[0].contact,
    // };

    // // to add additional claims based on role
    // if (auth.rows[0].role === "CUSTOMER") {
    //   const customerAddnClaims = await pool.query(
    //     `SELECT carts.uuid AS cart_id,
    //       first_name, last_name
    //       FROM carts
    //       JOIN user_details ON carts.user_id = user_details.user_id
    //       WHERE carts.user_id = $1
    //       `,
    //     [auth.rows[0].uuid]
    //   );

    //   claims.cart_id = customerAddnClaims.rows[0].cart_id;
    //   claims.first_name = customerAddnClaims.rows[0].first_name;
    //   claims.last_name = customerAddnClaims.rows[0].last_name;
    // } else if (auth.rows[0].role === "VENDOR") {
    //   const vendorAddnClaims = await pool.query(
    //     `SELECT address, postal_code,
    //         store_name, category, description
    //         FROM addresses
    //         JOIN vendor_details ON vendor_id = id
    //         WHERE id = $1
    //         `,
    //     [auth.rows[0].uuid]
    //   );

    //   claims.address = vendorAddnClaims.rows[0].address;
    //   claims.postal_code = vendorAddnClaims.rows[0].postal_code;
    //   claims.store_name = vendorAddnClaims.rows[0].store_name;
    //   claims.category = vendorAddnClaims.rows[0].category;
    //   claims.description = vendorAddnClaims.rows[0].description;
    // }

    // const access = jwt.sign(claims, String(process.env.ACCESS_SECRET), {
    //   expiresIn: "30d",
    //   jwtid: uuidv4(),
    // });
    // const refresh = jwt.sign(claims, String(process.env.REFRESH_SECRET), {
    //   expiresIn: "30d",
    //   jwtid: uuidv4(),
    // });

    res.json({ access, refresh, claims });
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "Login failed" });
  }
};

export { register };
