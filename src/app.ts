import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import routes from './api/routes';
import { errorHandler } from './api/middleware/errorHandler';
import { getLandingPage } from './landingpage';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',getLandingPage );

app.use('/api', routes);

app.use(errorHandler);

export default app;
