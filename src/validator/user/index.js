const { updatePasswordPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const UserValidator = {
    validateUpdatePasswordPayload: (payload) => {
        const validationResult = updatePasswordPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
}

module.exports = UserValidator