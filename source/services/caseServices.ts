import Case from "../models/caseModel";
import { failureResponse, successResponse } from "../utils/helper/api-handler";
import logger from "../utils/logger";
import { importData } from "./dataImportService";


class CaseService {

  aggregatedDataHndler = async ( startDate: any, endDate: any) => {
    try {
      let _data: any = ["this is working fine"];
      const matchStage: any = {};
      if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) {
          matchStage.createdAt.$gte = new Date(startDate as string);
        }
        if (endDate) {
          matchStage.createdAt.$lte = new Date(endDate as string);
        }
      }
      const pipeline = [
        { $match: matchStage },
        {
          $group: {
            _id: '$city',
            totalCases: { $sum: 1 }
          }
        }
      ];
  
      const result = await Case.aggregate(pipeline);
      console.log(result)
      return successResponse(result);
    } catch (error) {
      return failureResponse(error);
    }
  };
}

export default new CaseService();
