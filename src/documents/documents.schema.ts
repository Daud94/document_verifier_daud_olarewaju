import {model, Schema, Types} from "mongoose";
import {DocumentStatus} from "./enums/documents-status.enum";

const schemaDefinition = {
    user: {type: Types.ObjectId, ref: 'User', required: true, index: true},
    documentType: {type: String, required: true},
    documentUrl: {type: String, required: true},
    status: {type: String, required: true, enum: Object.values(DocumentStatus), default: DocumentStatus.PENDING},
} as const;
const documentsSchema = new Schema(schemaDefinition, {timestamps: true});

export const DocumentModel = model('Document', documentsSchema, 'documents');