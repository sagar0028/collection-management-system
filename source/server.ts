import app from "./app";
import config from "./config";
import http from "http";
import {Express} from "express";
import cron from "node-cron";
import logger from "./utils/logger";
import {errorHandler} from "./utils/helper/api-handler";
import mongoDB from "./connection/mongo";
import {importData} from "./services/dataImportService";


const router: Express = app;
const PORT: any = config.PORT;

/** Database */
mongoDB.connectDB();

/** Cron Job */
cron.schedule('0 10,17 * * *', async () => {
    logger.info('Starting scheduled data import job');
    await importData();
});

router.get("/", function (req, res) {
    res.status(200).send(`App listening on Port: ${PORT}`);
});

/** Error handling */
router.use(errorHandler);

/** Server */
const httpServer = http.createServer(router);
httpServer.listen(PORT, () =>
    console.log(`The server is running on port ${PORT}`)
)