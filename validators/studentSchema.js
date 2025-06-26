const Joi = require('joi');

const studentSchema = Joi.object({
  name: Joi.string().max(100).required(),
  roll_no: Joi.string().max(50).required(),
  email: Joi.string().email().max(100).required(),
  phone: Joi.string().pattern(/^\d{10}$/).required(),
  department: Joi.string().max(100).required(),
  year: Joi.number().integer().min(1).max(4).required()
});


module.exports = studentSchema;