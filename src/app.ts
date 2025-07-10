import express from 'express';
import {errorHandler} from "./middleware/error-handler";
import {notFound} from "./middleware/not-found";
import morgan from 'morgan';
import {AuthController} from "./auth/auth.controller";
import {DocumentController} from "./documents/documents.controller";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use('/auth', AuthController)
app.use('/documents', DocumentController)



// not found handler
app.use(notFound)

// error handler
// @ts-ignore
app.use(errorHandler)

export default app;