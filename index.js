import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import { connectionDb } from './db/connectionMongoDb.js';
import { routesAuth } from './routes/routesAuth.js';
import cookieParser from 'cookie-parser';
import { routesCategory } from './routes/routesCategory.js';
import { routesProduct } from './routes/routesProduct.js';
import { routesSupplier } from './routes/routesSupplier.js';
import { routesOrder } from './routes/routesOrder.js';
import { routesCustomer } from './routes/routesCustomer.js';
import { routesSales } from './routes/routesSales.js';

const app = express();

// Conexión a BD
connectionDb();

const corsOptions = {
    origin: 'https://api-tienda-xwt7.onrender.com',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// rutas
app.use('/auth', routesAuth);
app.use('/sale', routesSales);
app.use('/order', routesOrder);
app.use('/product', routesProduct);
app.use('/supplier', routesSupplier);
app.use('/customer', routesCustomer);
app.use('/category', routesCategory);

app.listen(PORT, () => {
    console.log('Corriendo en el puerto ' + PORT);
});