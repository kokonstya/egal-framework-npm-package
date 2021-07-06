import {Model} from "./Model";
import {EventObserver} from "../Actions/NetworkRequests/SocketConnection/Observer";


export class EgalConstructor {
    private egalModel: Model
    private egalObserver: EventObserver
    private modelName: string
    private userName: string
    private password: string
    private url: string
    private connectionType: string

    constructor(modelParams: {modelName: string, userName: string, password: string, url: string, connectionType: string}){
        this.modelName = modelParams.modelName
        this.userName = modelParams.userName
        this.password = modelParams.password
        this.url = modelParams.url
        this.connectionType = modelParams.connectionType
        this.egalModel = new Model(this.modelName, this.userName, this.password)
        this.egalObserver = new EventObserver()
        this.initModel()
    }

    initModel(){
        this.egalModel.setBaseUrl(this.url, this.connectionType)
        return this.egalModel
    }

    initModelObserver() {
        return new Promise((resolve, reject) => {
            this.egalObserver.subscribe(this.modelName, (data:any, actionName:string, modelName:string) => {

                let receivedData
                if(actionName !== 'error') {
                    receivedData = [data[0], actionName, modelName]
                    resolve(receivedData)
                } else {
                    receivedData = [data[0], actionName, modelName]
                    reject(receivedData)
                }
            })
        })
    }
}