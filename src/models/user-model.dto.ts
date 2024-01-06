import Joi from 'joi';

const userSchema = Joi.object({
    id: Joi.number().min(1).required(),
    name: Joi.string().required(),
    coords: Joi.object({
        lat: Joi.number().required().min(-90).max(90),
        lng: Joi.number().required().max(180).min(-180),
    })
});

const pathParametersSchema = Joi.object({
    distance: Joi.number().min(0).required(),
    time: Joi.number().min(0).required(),
});

export const userParametersSchema = Joi.object({
    user: userSchema,
    pathParameters: pathParametersSchema,
});