import Joi from "joi";

const userSchema = Joi.object({
  id: Joi.string().min(1).required(),
  name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  coords: Joi.object({
    lat: Joi.number().required().min(-90).max(90),
    lng: Joi.number().required().max(180).min(-180),
  }),
  role: Joi.string().valid("admin", "user", "guide"),
});

const pathParametersSchema = Joi.object({
  speed: Joi.number().min(0).required(),
});

export const userParametersSchema = Joi.object({
  user: userSchema,
  parameters: pathParametersSchema,
});

export const userAuthSchema = userSchema
  .fork(["id", "coords"], () => Joi.any().strip())
  .keys({
    password: Joi.string().required(),
  });
