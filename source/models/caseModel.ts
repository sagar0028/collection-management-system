import { Schema, model,Document } from "mongoose";



 export interface ICase extends Document {
    bankName: string;
    propertyName: string;
    city: string;
    borrowerName: string;
    createdAt: Date;
}

const caseSchema = new Schema<ICase>({
    bankName: { type: String, required: true },
    propertyName: { type: String, required: true },
    city: { type: String, required: true },
    borrowerName: { type: String, required: true },
    createdAt: { type: Date, required: true },
  });
  
  const Case = model<ICase>('Case', caseSchema);
  export default Case;
 