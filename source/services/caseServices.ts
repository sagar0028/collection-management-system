import {failureResponse, successResponse} from "../utils/helper/api-handler";
import logger from "../utils/logger";
import CaseModel from "../models/caseModel";


class CaseService {

    aggregatedDataHandler = async (startDate: any, endDate: any) => {
        try {
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
                {$match: matchStage},
                {
                    $group: {
                        _id: '$city',
                        totalCases: {$sum: 1}
                    }
                }
            ];
            const result = await CaseModel.aggregate(pipeline);
            return successResponse(result);
        } catch (error) {
            logger.error(error);
            return failureResponse(error);
        }
    };
}

export default new CaseService();
