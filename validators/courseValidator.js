const Joi = require('joi');

const courseSchema = Joi.object({
  name: Joi.string().max(100).required(),
  code: Joi.string().alphanum().max(20).required(),
  department: Joi.string().max(100).required(),
  credits: Joi.number().integer().min(1).max(10).required(),
});

module.exports = courseSchema;
