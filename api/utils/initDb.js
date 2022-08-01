const fs = require('fs');

fs.writeFileSync('data.json', JSON.stringify({
    users: [{
        id: 1,
        name: 'Admin',
        money: 2000
    }],
    products: [{
        id: 1,
        name: 'komputer',
        price: 2000,
        amount: 2
    }],
    orders: [{
        id: 1,
        productId: 1,
        userId: 1
    }]
}));
