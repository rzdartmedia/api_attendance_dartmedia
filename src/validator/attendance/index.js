const {
  AddAttendancePayloadSchema,
  ImageHeaderSchema
} = require("./schema");
const InvariantError = require("../../exceptions/InvariantError"); // custom message error and code error

const AttendanceValidator = {
  // function for validate type data which are given
  validateAddAthendancePayload: (payload) => {
    // check type data 
    const validationResult = AddAttendancePayloadSchema.validate(payload);

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

module.exports = AttendanceValidator;