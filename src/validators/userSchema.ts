import Joi from "joi";
import validator from "./validator";

const userSchema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    username: Joi.string().required(),
    email: Joi.string().pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).message("invalid email").required(),
    password: Joi.string().required().min(6).max(100),
    confirmPassword: Joi.valid(Joi.ref('password')).messages({
        'any.only': "password must match"
    })
});

export default validator(userSchema);