"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
let model = new index_1.EgalConstructor({ modelName: 'Load', userName: 'admin', password: 'password', url: 'http://breaker-develop.sputnikfund.ru/api', connectionType: 'axios', microserviceName: 'monolit' });
model.initModelObserver().then((data) => {
    console.log(data);
}).catch((error) => {
    console.log(error);
});
