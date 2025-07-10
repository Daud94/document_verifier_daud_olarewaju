import {DocumentModel} from "./documents.schema";
import {CreateDocumentType} from "./types/create-document.type";
import {DocumentQueryType} from "./types/document-query.type";
import {paginate} from "../utils/pagination";
import {publishMessage, VERIFY_DOCUMENT_QUEUE} from "../config/rabbitmq";
import {getValue} from "../config/redis";

const findOne = async (where: { [key: string]: any }) => {
    return await DocumentModel.findOne(where).exec();
}

const createDocument = async (payload: CreateDocumentType, userId: string) => {
    const document = await DocumentModel.create({
        user: userId,
        ...payload,
    });

    // Push a message to the verify_document queue
    await publishMessage(VERIFY_DOCUMENT_QUEUE, {
        documentId: document._id.toString()
    });

    return document;
}

const getDocument = async (id: string, userId?: string) => {
    // Try to get document status from Redis cache
    const cachedStatus = await getValue(`document:${id}:status`);

    // Get document from database
    const document = await DocumentModel.findOne({_id: id, ...(userId && {user: userId})}).lean(true).exec();

    // If document exists and we have a cached status, use the cached status
    if (document && cachedStatus) {
        console.log(`Using cached status for document ${id}: ${cachedStatus}`);
        return {
            ...document,
            status: cachedStatus
        };
    }

    return document;
}

const getAllCDocuments = async (query: DocumentQueryType, userId?: string) => {
    const skip = (query.page - 1) * (query.page - 1)
    const documents = await DocumentModel.find({
        ...(userId && {user: userId}),
        ...(query.status && {status: query.status}),
    }).skip(skip).limit(query.limit).lean(true).exec()

    const documentCounts = await DocumentModel.countDocuments({
        ...(userId && {user: userId}),
        ...(query.status && {status: query.status}),
    }).exec()

    const pagination = paginate(documentCounts, query.limit, query.page)

    // Check Redis cache for each document's status
    const updatedDocuments = await Promise.all(documents.map(async (doc) => {
        const cachedStatus = await getValue(`document:${doc._id}:status`);
        if (cachedStatus) {
            console.log(`Using cached status for document ${doc._id}: ${cachedStatus}`);
            return {
                ...doc,
                status: cachedStatus
            };
        }
        return doc;
    }));

    return {
        documents: updatedDocuments,
        pagination,
    }
}

export {findOne, createDocument, getDocument, getAllCDocuments}
