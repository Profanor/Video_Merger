import express from 'express';
import { Request, Response, NextFunction } from 'express';
import indexRoutes from './routes/index';
import logger from 'morgan';

const app = express()

//Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

app.use('/merge', indexRoutes);


// Middleware to handle 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
    const error: any = new Error('Not Found');
    error.status = 404;
    next(error); // Pass the error to the next middleware
});
  
  // Error-handling middleware
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message || 'Internal Server Error',
      },
    });
});

export default app;