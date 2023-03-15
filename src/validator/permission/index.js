const {
  AddPermissionPayloadSchema,
  ImageHeaderSchema,
  PutStatusApprovalPermissionPayloadSchema,
  PutPermissionRevisedPayloadSchema,
} = require("./schema");
const InvariantError = require("../../exceptions/InvariantError"); // custom message error and code error

const PermissionValidator = {
  // function for validate type data which are given
  validateAddPermissionPayload: (payload) => {
    // check type data 
    const validationResult = AddPermissionPayloadSchema.validate(payload);

    // if validation error throw error
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateImageHeaders: (headers) => {
    // check type data 
    const validationResult = ImageHeaderSchema.validate(headers);

    // if validation error throw error
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutStatusApprovalPermissionPayload: (payload) => {
    // check type data 
    const validationResult = PutStatusApprovalPermissionPayloadSchema.validate(payload);

    // if validation error throw error
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutApprovalRevisedPayload: (payload) => {
    // check type data 
    const validationResult = PutPermissionRevisedPayloadSchema.validate(payload);

    // if validation error throw error
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PermissionValidator;