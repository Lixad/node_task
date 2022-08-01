const fs = require('fs');
const data = require('../../data.json');

const getOrders = (_req, res) => {
    const orders = data.orders.map(ord => {
        const user = data.users.find(usr => usr.id === ord.userId);
        const prouct = data.products.find(prod => prod.id === ord.productId);
        return {
            ...ord,
            user: user.name,
            product: prouct.name,
        };
    });
    return res.status(200).send(orders);
};

const getOrder = (req, res) => {
    const order = data.orders.find(ord => ord.id === Number(req.params.orderID));
    if(!order) return res.status(404).send('Order with this id does not exist');
    const user = data.users.find(usr => usr.id === order.userId);
    const prouct = data.products.find(prod => prod.id === order.productId);

    return res.status(200).send({
        ...order,
        user: user.name,
        product: prouct.name,
    });
};

const createOrder = (req, res) => {
    if (
        !req.body.hasOwnProperty('userId') ||
        !req.body.hasOwnProperty('productId')
    ) return res.status(400).send('To create order you have to send userId and productId');

    const userId = Number(req.body.userId);
    const productId = Number(req.body.productId);

    const user = data.users.find(usr => usr.id === userId);
    const product = data.products.find(prod => prod.id === productId);

    if(!user) return res.status(400).send('User with this id does not exist');
    if(!product) return res.status(400).send('Product with this id does not exist');
    if(user.money - product.price < 0) return res.status(400).send('User has not enough money to make this order');
    if(!product.amount) return res.status(400).send('Out of stock');
    
    user.money -= product.price;
    --product.amount;

    const newOrder = {
        id: data.orders.length ? data.orders[data.orders.length - 1].id + 1 : 1,
        userId,
        productId,
    };

    data.orders.push(newOrder);
    fs.writeFileSync('data.json', JSON.stringify(data));
    return res.status(201).send('Order created');
  
};

const deleteOrder = (req, res) => {
    const order = data.orders.find(ord => ord.id === Number(req.params.orderID));
    if(!order) return res.status(404).send('Order with this id does not exist');

    const user = data.users.find(usr => usr.id === order.userId);
    const product = data.products.find(prod => prod.id === order.productId);

    ++product.amount;
    user.money += product.price;

    data.orders.splice(data.orders.indexOf(order), 1);
    fs.writeFileSync('data.json', JSON.stringify(data));
    return res.status(200).send('Order deleted');
};

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    deleteOrder,
};
