import * as crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { Db } from "mongodb";

export function hashPassword(password: string) {
  if (!password) {
    password = "";
  }

  const sha265 = crypto.createHash("sha256");
  return sha265.update(password).digest("base64");
}

export function generateAuthToken() {
  return crypto.randomBytes(30).toString('hex');
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  next();
}

export function getDatabase(req: Request): Promise<Db> {
  const db: Db = req.app.locals.db;

  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
    } else {
      reject("Could not retrieve database client object");
    }
  });
}
