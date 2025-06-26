const Joi = require('joi');

const markSchema = Joi.object({
  course_id: Joi.number().integer().positive().required(),
  marks: Joi.number().integer().min(0).max(100).required()
});

module.exports = markSchema;
