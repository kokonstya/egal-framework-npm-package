import {EgalConstructor} from "./index";


let model = new EgalConstructor({modelName:'Load', userName:'admin', password:'password', url:'http://breaker-develop.sputnikfund.ru/api', connectionType: 'axios'})
// model.actionGetItems('monolit', 'axios')
let getItem = model.deleteItemFromStore('id', 2)
console.log(getItem, 'store')