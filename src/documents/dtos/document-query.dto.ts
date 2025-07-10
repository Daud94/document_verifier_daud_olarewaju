import Joi from "joi";
import {DocumentStatus} from "../enums/documents-status.enum";

export const DocumentQueryDto = Joi.object({
    status: Joi.string().required().allow(DocumentStatus),
    search: Joi.string().required(),
    page: Joi.string().required().min(1),
    limit: Joi.number().required().max(100),
})