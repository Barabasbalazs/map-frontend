import Joi from "joi";

export const pathPointSchema = Joi.object({
  coordinates: Joi.object({
    lat: Joi.number().required().min(-90).max(90),
    lng: Joi.number().required().max(180).min(-180),
  }),
  name: Joi.string().required(),
});
