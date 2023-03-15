const Joi = require("joi"); //plugin for validate type data and input from user

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

module.exports = {
  AddAttendancePayloadSchema,
  ImageHeaderSchema,
};