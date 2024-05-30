import { connect } from "mongoose";
import config from "../config/index";
import logger from "../utils/logger";

class Mongo {
    private _connectionString: string;
    constructor(connectionString: any) {
        this._connectionString = connectionString;
    }

    connectDB = async () => {
        try {
            await connect(this._connectionString);
            console.log("Connected to Mongo database...");
        } catch (error) {
            logger.error(error);
        }
    };
}

export default new Mongo(config.MONGODB_URI);