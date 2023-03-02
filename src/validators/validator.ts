import {ObjectSchema} from "joi";
const validator = (schema:ObjectSchema<any>) => (body:any) => {
    const result =  schema.validate(body, {abortEarly: false, stripUnknown: true});
    return result;
};

export default validator;