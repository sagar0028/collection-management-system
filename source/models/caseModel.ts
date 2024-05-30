import {getModelForClass, prop} from '@typegoose/typegoose';

class CaseModel {
    @prop({required: true})
    public bankName?: string;

    @prop({required: true})
    public propertyName?: string;

    @prop({required: true})
    public city?: string;

    @prop({required: true})
    public borrowerName?: string;

    @prop({required: true})
    public createdAt?: Date;
}

const Case = getModelForClass(CaseModel);
export default Case;