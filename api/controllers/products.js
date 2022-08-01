const fs = require('fs');
const data = require('../../data.json');

const getProducts = (_req, res) => {
    return res.status(200).send(data.products);
};

const getProduct = (req, res) => {
    const product = data.products.find(prod => prod.id === Number(req.params.productID));
    if(!product) return res.status(404).send('Product with this Id does not exist');
    return res.status(200).send(product);
};

const createProduct = (req, res) => {
    if (
        !req.body.hasOwnProperty('price') ||
        !req.body.hasOwnProperty('name') ||
        !req.body.hasOwnProperty('amount')
    ) return res.status(400).send('To create product you have to send his name, price and amount');

    const price = Number(req.body.price);
    const amount = Number(req.body.amount);

    if(isNaN(price)) return res.status(400).send('Price must be number!');
    if(isNaN(amount)) return res.status(400).send('Amount must be number!');

    const newProduct = {
        id: data.products.length ? data.products[data.products.length - 1].id + 1 : 1,
        name: req.body.name,
        price,
        amount,
    };

    data.products.push(newProduct);
    fs.writeFileSync('data.json', JSON.stringify(data));
    return res.status(201).send('Product created');
};

const updateProduct = (req, res) => {
    if (
        !req.body.hasOwnProperty('price') &&
        !req.body.hasOwnProperty('name') &&
        !req.body.hasOwnProperty('amount')
    ) return res.status(400).send('To update product you need to send at least 1 property to update (name, amount or price)');

    if(req.body.price) if(isNaN(Number(req.body.price))) return res.status(400).send('Price must be number!');
    if(req.body.amount) if(isNaN(Number(req.body.amount))) return res.status(400).send('Amount must be number!');

    const product = data.products.find(prod => prod.id === Number(req.params.productID));

    if(req.body.name) product.name = req.body.name;
    if(req.body.price) product.price = Number(req.body.price);
    if(req.body.amount) product.amount = Number(req.body.amount);

    fs.writeFileSync('data.json', JSON.stringify(data));
    return res(200).status.send('Product updated');
};

const deleteProduct = (req, res) => {
    const productId = Number(req.params.productID);
    const product = data.products.find(prod => prod.id === productId);

    if(!product) return res.status(404).send('Product with this id does not exist');

    let order = undefined;

    do {
        order = data.orders.find(order => order.productId === productId);
        if(order) {
            const user = data.users.find(user => user.id === order.userId);
            user.money += product.price;
            const orderIndex = data.orders.indexOf(order);
            data.orders.splice(orderIndex, 1);
        }
    } while(order);

    data.products.splice(data.products.indexOf(product), 1);
    fs.writeFileSync('data.json', JSON.stringify(data));
    return res.status(200).send('Product deleted');
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};
