function validateWithSchema(schema, data, view, extraData = {}) {
  const { error } = schema.validate(data);
  if (error) {
    const err = new Error(`Validation failed: ${error.details[0].message}`);
    err.status = 400;
    err.view = view;
    err.data = { ...extraData, student: data };
    throw err;
  }
}

module.exports = validateWithSchema;