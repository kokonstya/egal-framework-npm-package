import {EgalConstructor} from "./index";


let model = new EgalConstructor({modelName:'Load', userName:'admin', password:'password', url:'http://breaker-develop.sputnikfund.ru/api', connectionType: 'axios', microserviceName: 'monolit'})
model.initModelObserver().then((data) => {
    console.log(data)
}).catch((error) => {
    console.log(error)
})
