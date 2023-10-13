import { Request, Response } from "express";
import authRouter from "./modules/auth";
import bannerRouter from './modules/banner'
import categoryARouter from "./modules/categories"
export const routes = (app: any) => {
  // routes
  app.get("/", (req: Request, res: Response) => {
    res.json("Wellcome to api");
  });
  app.use("/auth", authRouter);
  app.use("/banner", bannerRouter)
  app.use("/categories", categoryARouter);
};
