import {RoutingKeyParams} from "../Actions/Interfaces/RoutingKeyParams";
import  {Method} from 'axios';

export interface ModelInterface {

  actionGetMetadata(microserviceName: string, connectionType: string): void;

  actionGetItem(
    microserviceName: string,
    connectionType: string,
    id: string,
    filter?: (string | object)[] | undefined,
    orders?: object[]
  ): void;

  actionGetItems(
    microserviceName: string,
    connectionType: string,
    perPage?: number,
    page?: number,
    filter?: (string | object)[] | undefined,
    withs?: string | string [] | undefined,
    orders?: object[]
  ): void;

  actionCreate(
    microserviceName: string,
    connectionType: string,
    actionParams?: any,
    channelParameters?: RoutingKeyParams | undefined
  ): void;

  actionCreateMany(
      microserviceName: string,
      connectionType: string,
      actionParams?: any,
      channelParameters?: RoutingKeyParams | undefined
  ): void;

  actionCustom(
      microserviceName: string,
      actionName: string,
      connectionType: string,
      requestType?: Method,
      actionParams?: any
  ): void;

  actionUpdate(
    microserviceName: string,
    connectionType: string,
    actionParams?: any
  ): void;

  actionUpdateMany(
      microserviceName: string,
      connectionType: string,
      actionParams?: any
  ): void;

  actionDelete(
    microserviceName: string,
    connectionType: string,
    actionParams?: any
  ): void;

  actionDeleteMany(
      microserviceName: string,
      connectionType: string,
      actionParams?: any
  ): void;

  getModelMetadata(): void;

  getModelActionList(): void;

  getModelValidationRules(): void;

  getModelActionsMetaData(): void;

  getModelDataBaseFields(): string[];

  getModelFieldsWithTypes(): object[];

  actionUpdateManyWithFilter(
    microserviceName: string,
    connectionType: string,
    actionParams: object
  ): void;

  actionDeleteManyWithFilter(
    microserviceName: string,
    connectionType: string,
    actionParams: object
  ): void;

  getSpecificFields(
    fields: string[],
    filterType: string,
    dataToFilter: string | object | object[]
  ): void;

  setBaseUrl(URL: string, connectionType: string): void;
}
