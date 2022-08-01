const express = require('express');
const app = express();
const products_routes = require('./routes/products');
const users_routes = require('./routes/users');
const orders_routes = require('./routes/orders');

app.use(express.json());

app.use('/api/products', products_routes);
app.use('/api/users', users_routes);
app.use('/api/orders', orders_routes);

app.listen(5000);
