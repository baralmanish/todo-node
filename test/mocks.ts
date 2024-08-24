import "jest";
import { Request, Response } from "express";

export const mockRequest = (): Partial<Request> => {
  const req: Partial<Request> = {
    body: {},
    params: {},
    query: {},
    header: jest.fn().mockReturnValue(""),
    get: jest.fn().mockReturnValue("")
  };
  return req;
};

export const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };
  return res;
};
