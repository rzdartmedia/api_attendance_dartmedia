const Joi = require("joi").extend(require('@joi/date')); //plugin for validate type data and input from user

// validation type data for login
const AddAttendancePayloadSchema = Joi.object({
  photo: Joi.allow().required(),
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

const GetAttendanceQuerySchema = Joi.object({
  limit: Joi.number().allow(),
  page: Joi.number().allow(),
  name: Joi.string().max(100).allow(),
  statusAttendanceIn: Joi.string().max(50).allow(),
  startDateFilter: Joi.date().format('YYYY-MM-DD').utc().allow(),
  endDateFilter: Joi.date().format('YYYY-MM-DD').utc().allow(),
});

module.exports = {
  AddAttendancePayloadSchema,
  ImageHeaderSchema,
  GetAttendanceQuerySchema,
};