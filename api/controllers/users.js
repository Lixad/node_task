const fs = require('fs');
const data = require('../../data.json');

const getUsers = (_req, res) => {
    return res.status(200).send(data.users);
};

const getUser = (req, res) => {
    const user = data.users.find(usr => usr.id === Number(req.params.userID));
    if(!user) return res.status(404).send('User with this id does not exist');
    return res.status(200).send(user);
};

const createUser = (req, res) => {
    if (
        !req.body.hasOwnProperty('money') ||
        !req.body.hasOwnProperty('name')
    ) return res.status(400).send('To create user you have to send his name and money');

    const money = Number(req.body.money);

    if(isNaN(money)) return res.status(400).send('Money must be number!');

    const newUser = {
        id: data.users.length ? data.users[data.users.length - 1].id + 1 : 1,
        name: req.body.name,
        money,
    };

    data.users.push(newUser);
    fs.writeFileSync('data.json', JSON.stringify(data));
    return res.status(201).send('User created');
};

const updateUser = (req, res) => {
    if (
        !req.body.hasOwnProperty('money') &&
        !req.body.hasOwnProperty('name')
    ) return res.status(400).send('To update user you need to send at least 1 property to update (name or money)');

    if(req.body.money) if(isNaN(Number(req.body.money))) return res.status(400).send('Money must be number!');

    const user = data.users.find(usr => usr.id === Number(req.params.userID));

    if(req.body.name) user.name = req.body.name;
    if(req.body.money) user.money = Number(req.body.money);

    fs.writeFileSync('data.json', JSON.stringify(data));
    return res(200).status.send('User updated');
};

const deleteUser = (req, res) => {
    const userId = Number(req.params.userID);
    const user = data.users.find(usr => usr.id === userId);

    if(!user) return res.status(404).send('User with this id does not exist');

    let order = undefined;

    do {
        order = data.orders.find(order => order.userId === userId);
        if(order) {
            const product = data.products.find(prod => prod.id === order.productId);
            ++product.amount;
            const orderIndex = data.orders.indexOf(order);
            data.orders.splice(orderIndex, 1);
        }
    } while(order);

    data.users.splice(data.users.indexOf(user), 1);
    fs.writeFileSync('data.json', JSON.stringify(data));
    return res.status(200).send('User deleted');
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
