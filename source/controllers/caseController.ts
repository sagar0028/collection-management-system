import { Request, Response, NextFunction, Router } from "express";
import logger from "../utils/logger";
import caseService from "../services/caseServices";

class CaseController {
    router = Router();
    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get("/aggregatedData", this.aggregatedData);
    }


    private aggregatedData = async (
        req: Request,
        res: Response,
        next: NextFunction
    )=> {
        try {
          const { startDate, endDate } = req.query;
          const data = await caseService.aggregatedDataHndler(startDate, endDate);
          return res.status(data.statusCode).send(data.responseBody);
        } catch (err) {
          logger.error(err);
          return res.status(500).send("Internal Server Error");
        }
      }
}

export default new CaseController();