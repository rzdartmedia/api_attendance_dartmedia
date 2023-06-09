const Joi = require("joi"); //plugin for validate type data and input from user

// validation type data for login
const AddAuthenticationPayloadSchema = Joi.object({
  noHp: Joi.string().max(20).required(),
  password: Joi.string().required(),
});

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required()
})

module.exports = {
  AddAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema
};