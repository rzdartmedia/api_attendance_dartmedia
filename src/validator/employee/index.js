const InvariantError = require("../../exceptions/InvariantError");
const {
  AddEmployeePayloadSchema,
  putStatusEmployeeByNikPayloadSchema,
  ImageHeaderSchema
} = require("./schema");

const EmployeeValidator = {
  // function for validate type data which are given
  validateAddEmployeePayload: (payload) => {
    // check type data 
    const validationResult = AddEmployeePayloadSchema.validate(payload);

    // if validation error throw error
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutStatusEmployeeByNikPayloadPayload: (payload) => {
    // check type data 
    const validationResult = putStatusEmployeeByNikPayloadSchema.validate(payload);

    // if validation error throw error
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeaderSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = EmployeeValidator;