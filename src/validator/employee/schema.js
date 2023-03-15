const Joi = require("joi"); //plugin for validate type data and input from user

// validation type data for login
const AddEmployeePayloadSchema = Joi.object({
  name: Joi.string().max(100).required(),
  position: Joi.string().max(50).required(),
  division: Joi.string().max(50).required(),
  gender: Joi.string().max(20).required(),
  nik: Joi.string().max(20).required().pattern(/^[0-9]+$/, 'numbers'),
  npwp: Joi.string().allow().max(20).pattern(/^[0-9]+$/, 'numbers'),
  placeOfBirth: Joi.string().max(50).required(),
  dateOfBirth: Joi.date().required(),
  addressKtp: Joi.string().required(),
  address: Joi.string().required(),
  noHp: Joi.string().max(15).min(9).required().pattern(/^(\+62|62|0)8[1-9][0-9]{6,12}$/, 'is not valid'),
  religion: Joi.string().max(20).required(),
  emailPersonal: Joi.string().email({
    tlds: true
  }).required(),
  emailEmployee: Joi.string().email({
    tlds: true
  }).required(),
  ptkp: Joi.string().max(5).required(),
  blood: Joi.string().min(1).max(5).required().pattern(/^[A-Z]+$/),
  photoKtp: Joi.required(),
  photoNpwp: Joi.allow(),
  photoSwa: Joi.required(),
  nameFamily: Joi.string().max(100).required(),
  connectionFamily: Joi.string().max(100).required(),
  noHpFamily: Joi.string().max(15).min(9).required().pattern(/^(\+62|62|0)8[1-9][0-9]{6,12}$/, 'is not valid'),
  addressFamily: Joi.string().required(),
  workLocation: Joi.string().required(),
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
  AddEmployeePayloadSchema,
  ImageHeaderSchema
};