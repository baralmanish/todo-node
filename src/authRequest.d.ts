import { Request } from "express";

export interface IAuthInfoRequest extends Request {
  userId?: number;
}
