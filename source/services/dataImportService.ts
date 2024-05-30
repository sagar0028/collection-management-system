import axios from 'axios';
import csvParser from 'csv-parser';
import { pipeline } from 'stream';
import { promisify } from 'util';
import Case from '../models/caseModel';
import logger from '../utils/logger';

const pipelineAsync = promisify(pipeline);

const DATA_URL = 'https://docs.google.com/spreadsheets/d/12mSemOq6hNvfa5y2JNYNJosB_Mz185edTzg4Xmp--KA/export?format=csv';

export const importData = async () => {
  try {
  console.log("<<<<<<<<<<<<<<<<<<DATA_IMPORT_FUNCTION_START>>>>>>>>>>>>>>>>>>>>>>")
    const response = await axios.get(DATA_URL, { responseType: 'stream' });
    
    const records: any[] = [];
    
    await pipelineAsync(
      
      response.data,
      csvParser(),

      async function* (source) {
        for await (const record of source) {
          records.push({
            bankName: record['Bank name'],
            propertyName: record['Property name'],
            city: record['City'],
            borrowerName: record['Borrower name'],
            createdAt: new Date(record['Created At']),
          });

          if (records.length >= 1000) {
            console.log(records); 
            await Case.insertMany(records);
            records.length = 0;
          }
        }

        if (records.length > 0) {
          await Case.insertMany(records);
        }
      }
    );

    logger.info('Data import completed successfully');
  } catch (error) {
    logger.error(`Error during data import: ${error}`);
  }
};
