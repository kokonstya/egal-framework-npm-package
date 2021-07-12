import {Model} from "./Model";
import {EventObserver} from "../Actions/NetworkRequests/SocketConnection/Observer";


export class EgalConstructor {
    private readonly egalModel: Model
    private egalObserver: EventObserver = EventObserver.getInstance()
    private readonly modelName: string
    private readonly userName: string
    private readonly password: string
    private readonly url: string
    private readonly connectionType: string

    constructor(modelParams: {modelName: string, userName: string, password: string, url: string, connectionType: string}){
        this.modelName = modelParams.modelName
        this.userName = modelParams.userName
        this.password = modelParams.password
        this.url = modelParams.url
        this.connectionType = modelParams.connectionType
        this.egalModel = new Model(this.modelName, this.userName, this.password)
        // this.egalObserver = EventObserver.getInstance()
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