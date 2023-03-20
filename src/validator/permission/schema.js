const Joi = require("joi").extend(require('@joi/date')); //plugin for validate type data and input from user

// validation type data for login
const AddPermissionPayloadSchema = Joi.object({
  categoryPermission: Joi.string().required().max(50),
  startPermitDate: Joi.date().format('YYYY-MM-DD').utc().required(),
  endPermitDate: Joi.date().format('YYYY-MM-DD').utc().required(),
  informationPermission: Joi.string().required(),
  attachment: Joi.allow(),
});

const ImageHeaderSchema = Joi.object({
  "content-type": Joi.string()
    .valid(
      "image/apng",
      "image/avif",
      "image/gif",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp"
    ), // refrensi mime type
}).unknown();

const PutStatusApprovalPermissionPayloadSchema = Joi.object({
  idPermission: Joi.number().required(),
  statusApproval: Joi.string().required().max(50),
  informationApproval: Joi.string().required()
})

const PutPermissionRevisedPayloadSchema = Joi.object({
  idPermission: Joi.number().required(),
  categoryPermission: Joi.string().required().max(50),
  startPermitDate: Joi.date().format('YYYY-MM-DD').utc().required(),
  endPermitDate: Joi.date().format('YYYY-MM-DD').utc().required(),
  informationPermission: Joi.string().required(),
  attachment: Joi.allow(),
})

const GetEmployeeQuerySchema = Joi.object({
  limit: Joi.number().allow(),
  page: Joi.number().allow(),
  name: Joi.string().max(100).allow(),
  statusApproval: Joi.string().max(50).allow(),
  startDateFilter: Joi.date().format('YYYY-MM-DD').utc().allow(),
  endDateFilter: Joi.date().format('YYYY-MM-DD').utc().allow(),
});

module.exports = {
  AddPermissionPayloadSchema,
  ImageHeaderSchema,
  PutStatusApprovalPermissionPayloadSchema,
  PutPermissionRevisedPayloadSchema,
  GetEmployeeQuerySchema,
};