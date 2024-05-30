import * as dotenv from "dotenv";

dotenv.config();

export default{
    MONGODB_URI: process.env.MONGODB_URI,
    PORT:  process.env.PORT || 8001
}