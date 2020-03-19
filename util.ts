import * as crypto from "crypto";
import { Request, Response, NextFunction } from "express";

export function hashPassword(password: string) {
  const sha265 = crypto.createHash("sha256");
  return sha265.update(password).digest("base64");
}

export function generateAuthToken() {
  return crypto.randomBytes(30).toString('hex');
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  next();
}
