import { Request, Response } from "express";
import authRouter from "./modules/auth";
import categoryARouter from "./modules/categories"
export const routes = (app: any) => {
  // routes
  app.get("/", (req: Request, res: Response) => {
    res.json("Wellcome to api");
  });
  app.use("/auth", authRouter);
  app.use("/categories", categoryARouter);
};
