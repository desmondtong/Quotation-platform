import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!("authorization" in req.headers)) {
    return res
      .status(401)
      .json({ status: "error", msg: "No auth authorization token found" });
  }

  // optional chaining replace() method to prevent "undefined" error
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET as Secret); // type String does not work
      req.decoded = decoded; // declared type of decoded in index.d.ts
      next();
    } catch (error) {
      return res.status(401).json({ status: "error", msg: "unauthorised" });
    }
  } else {
    return res.status(401).json({ status: "error", msg: "forbidden" });
  }
};

const authSupplier = (req: Request, res: Response, next: NextFunction) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "no token found" });
  }

  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET as Secret);

      if (typeof decoded === "string") {
        // Handle the case where decoded is a string
      } else if (decoded.role === "SUPPLIER") {
        req.decoded = decoded;
        next();
      } else {
        throw new Error();
      }
    } catch (error) {
      return res.status(401).json({ status: "error", msg: "unauthorised" });
    }
  } else {
    return res.status(403).send({ status: "error", msg: "forbidden" });
  }
};

const authCustomer = (req: Request, res: Response, next: NextFunction) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "no token found" });
  }

  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET as Secret);

      if (typeof decoded === "string") {
        // Handle the case where decoded is a string
      } else if (decoded.role === "CUSTOMER") {
        req.decoded = decoded;
        next();
      } else {
        throw new Error();
      }
    } catch (error) {
      return res.status(401).json({ status: "error", msg: "unauthorised" });
    }
  } else {
    return res.status(403).send({ status: "error", msg: "forbidden" });
  }
};

export { auth, authSupplier, authCustomer };
