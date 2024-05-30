import axios from 'axios';
import csvParser from 'csv-parser';
import {pipeline} from 'stream';
import {promisify} from 'util';
import Case from '../models/caseModel';
import logger from '../utils/logger';

const pipelineAsync = promisify(pipeline);

const DATA_URL = 'https://docs.google.com/spreadsheets/d/12mSemOq6hNvfa5y2JNYNJosB_Mz185edTzg4Xmp--KA/export?format=csv';

export const importData = async () => {
    try {
        console.log("<<<<<<<<<<<<<<<<<<DATA_IMPORT_FUNCTION_START>>>>>>>>>>>>>>>>>>>>>>")
        const response = await axios.get(DATA_URL, {responseType: 'stream'});

        let recordsBuffer: any[] = [];
        let isPaused = false;

        response.data
            .pipe(csvParser())
            .on('data', async (record: any) => {
                recordsBuffer.push({
                    bankName: record['Bank name'],
                    propertyName: record['Property name'],
                    city: record['City'],
                    borrowerName: record['Borrower name'],
                    createdAt: new Date(record['Created At']),
                });

                if (recordsBuffer.length >= 1000) {
                    response.data.pause();
                    isPaused = true;
                    await Case.insertMany(recordsBuffer);
                    recordsBuffer = [];
                    response.data.resume();
                    isPaused = false;
                }
            })
            .on('end', async () => {
                if (recordsBuffer.length > 0) {
                    await Case.insertMany(recordsBuffer);
                }
                logger.info('Data import completed successfully');
            })
            .on('error', (error: Error) => {
                logger.error(`Error during data import: ${error}`);
            });

        response.data.on('end', () => {
            if (!isPaused) {
                logger.info('Data import completed successfully');
            }
        });
    } catch (error) {
        logger.error(`Error during data import: ${error}`);
    }
};
