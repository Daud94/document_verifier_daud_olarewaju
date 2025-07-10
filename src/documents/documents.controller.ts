import express, {Response, Request, NextFunction} from 'express';

const router = express.Router();
import {Body} from "../validators/body.validator";
import {CreateDocumentDto} from "./dtos/create-document.dto";
import {createDocument, getAllCDocuments, getDocument} from "./documents.service";
import {Query} from "../validators/query.validator";
import {DocumentQueryDto} from "./dtos/document-query.dto";


router.post('/', Body(CreateDocumentDto), async (req: Request, res: Response, next: NextFunction) => {
    try {
        //@ts-ignore
        await createDocument(req.body, req.user.userId);
        res.status(201).json({
            success: true,
            message: 'Document created!',
        });
    } catch (error) {
        next(error);
    }
})

router.get('/', Query(DocumentQueryDto), async (req: Request, res: Response, next: NextFunction) => {
    const options: { [key: string]: any } = {}
    //@ts-ignore
    if (req.user.role === 'admin') {
        options['userId'] = undefined
    } else {
        //@ts-ignore
        options['userId'] = req.user.role
    }
    try {
        //@ts-ignore
        const result = await getAllCDocuments(req.query, options.userId);
        res.status(200).json({
            success: true,
            message: 'Document fetched',
            data: result.documents,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
})

router.get(':id', async (req: Request, res: Response, next: NextFunction) => {
    const options: { [key: string]: any } = {}
    //@ts-ignore
    if (req.user.role === 'admin') {
        options['userId'] = undefined
    } else {
        //@ts-ignore
        options['userId'] = req.user.role
    }
    try {
        //@ts-ignore
        const document = await getDocument(req.params.id, options.userId);
        res.status(200).json({
            success: true,
            message: 'Document fetched',
            data: document,
        });
    } catch (error) {
        next(error);
    }
})


export const DocumentController = router;