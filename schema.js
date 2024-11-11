const Joi = require('joi');

module.exports.employeeSchema = Joi.object({
    employee : Joi.object({
        name: Joi.string().required(),
        image: Joi.string().allow("",null),
        email: Joi.string().required(),
        mobile: Joi.number().required().min(10),
        gender: Joi.string().required(),
        course: Joi.string().required(),
        designation: Joi.string().required(),
    })
})