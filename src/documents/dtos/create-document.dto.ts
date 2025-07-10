import Joi from "joi";

export const CreateDocumentDto = Joi.object({
    documentType: Joi.string().email().required(),
    documentUrl: Joi.string().required()
})