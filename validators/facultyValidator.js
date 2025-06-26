const Joi = require('joi');

const facultySchema = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().max(100).required(),
  phone: Joi.string().pattern(/^\d{10}$/).required(),
  department: Joi.string().max(100).required(),
  designation: Joi.string().max(100).required()
});

module.exports = facultySchema;
