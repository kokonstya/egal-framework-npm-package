import {Model} from "./Model";
import {EventObserver} from "../Actions/NetworkRequests/SocketConnection/Observer";

export class ReactConstructor extends Model {
  private readonly egalModel: Model;
  private egalObserver: EventObserver = EventObserver.getInstance();
  modelName: string;
  userName: string;
  password: string;
  listenerFunction: Function;
  environment: string;
  private readonly url: string;
  private readonly connectionType: string;

  constructor(modelParams: {
    modelName: string;
    userName: string;
    password: string;
    url: string;
    connectionType: string;
    tokenName: string;
    listenerFunction: Function;
    environment: string;
  }) {
    super(
      modelParams.modelName,
      modelParams.userName,
      modelParams.password,
      modelParams.environment,
    );
    this.modelName = modelParams.modelName;
    this.userName = modelParams.userName;
    this.password = modelParams.password;
    this.listenerFunction = modelParams.listenerFunction;
    this.environment = modelParams.environment;
    this.url = modelParams.url;
    this.connectionType = modelParams.connectionType;
    this.egalModel = new Model(this.modelName, this.userName, this.password, this.environment);
    this.initModel();
  }

  initModel() {
    this.egalModel.setEnvironment(this.environment);
    this.egalModel.setBaseUrl(this.url, this.connectionType);
    return this.egalModel;
  }

  initModelObserver() {
    console.log(this.modelName, 'modelName from initModelObserver');
    this.egalObserver.subscribe(
      this.modelName,
      (data: any, actionName: string, modelName: string, actionMessage: object) => {
        console.log('initModelObserver');
        const receivedData = [data[0], actionName, modelName, actionMessage];
        this.listenerFunction(receivedData);
      },
    );
  }
}
