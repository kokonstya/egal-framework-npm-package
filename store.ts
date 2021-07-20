import {EgalConstructor} from "./index";

let model = new EgalConstructor({modelName:'name', userName:'admin', password:'password', url:'url', connectionType: 'axios'})
model.actionGetItems('monolit', 'axios')
console.log(model, 'store')