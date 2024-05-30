import {Express} from "express";
import caseController from "../controllers/caseController"

const apiV1 = `/api/v1/`;


export default (app: Express) => {
    app.use(`${apiV1}cases`, caseController.router);
};

