import Joi from "joi";
import validator from "./validator";

const postSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string(),
});

export default validator(postSchema);