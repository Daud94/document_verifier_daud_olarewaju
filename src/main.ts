import app from './app';
import {ConfigService} from "./config/config.service";
import {connectDatabase} from "./config/config";
import {connectRabbitMQ} from "./config/rabbitmq";
import {startDocumentVerifierWorker} from "./workers/document-verifier.worker";
const configService = new ConfigService();


const port: string = configService.get('PORT');

app.listen(port, async() => {
    await connectDatabase();
    await connectRabbitMQ();

    // Start the document verifier worker
    await startDocumentVerifierWorker();

    console.log(`Server is running on http://localhost:${port}`);
});
