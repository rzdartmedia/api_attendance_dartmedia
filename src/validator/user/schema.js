const Joi = require("joi")

const updatePasswordPayloadSchema = Joi.object({
    passwordOld: Joi.string().required(),
    passwordNew: Joi.string()
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?=.*[a-zA-Z]).{8,}$/)
        .required()
        .messages({
            "string.pattern.base":
                "Password tidak valid minimal 8 character, terdapat huruf besar, terdapat angka, dan terdapat character khusus",
        }),
});

module.exports = {
    updatePasswordPayloadSchema
}