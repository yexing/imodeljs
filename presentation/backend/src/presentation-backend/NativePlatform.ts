/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Core
 */

import { ClientRequestContext, IDisposable } from "@bentley/bentleyjs-core";
import { IModelDb, IModelHost, IModelJsNative } from "@bentley/imodeljs-backend";
import { PresentationError, PresentationStatus, UpdateInfoJSON, VariableValueJSON, VariableValueTypes } from "@bentley/presentation-common";
import { PresentationManagerMode } from "./PresentationManager";

/** @internal */
export enum NativePlatformRequestTypes {
  GetRootNodes = "GetRootNodes",
  GetRootNodesCount = "GetRootNodesCount",
  GetChildren = "GetChildren",
  GetChildrenCount = "GetChildrenCount",
  GetNodePaths = "GetNodePaths",
  GetFilteredNodePaths = "GetFilteredNodePaths",
  LoadHierarchy = "LoadHierarchy",
  GetContentDescriptor = "GetContentDescriptor",
  GetContentSetSize = "GetContentSetSize",
  GetContent = "GetContent",
  GetDistinctValues = "GetDistinctValues",
  GetPagedDistinctValues = "GetPagedDistinctValues",
  GetDisplayLabel = "GetDisplayLabel",
  CompareHierarchies = "CompareHierarchies",
}

/** @internal */
export interface NativePlatformDefinition extends IDisposable {
  forceLoadSchemas(db: any): Promise<void>;
  setupRulesetDirectories(directories: string[]): void;
  setupSupplementalRulesetDirectories(directories: string[]): void;
  getImodelAddon(imodel: IModelDb): any;
  getRulesets(rulesetId: string): string;
  addRuleset(serializedRulesetJson: string): string;
  removeRuleset(rulesetId: string, hash: string): boolean;
  clearRulesets(): void;
  handleRequest(db: any, options: string): Promise<string>;
  getRulesetVariableValue(rulesetId: string, variableId: string, type: VariableValueTypes): VariableValueJSON;
  setRulesetVariableValue(rulesetId: string, variableId: string, type: VariableValueTypes, value: VariableValueJSON): void;
  getUpdateInfo(): UpdateInfoJSON | undefined;
}

/** @internal */
export interface DefaultNativePlatformProps {
  id: string;
  localeDirectories: string[];
  taskAllocationsMap: { [priority: number]: number };
  mode: PresentationManagerMode;
  isChangeTrackingEnabled: boolean;
  cacheDirectory: string;
}

/** @internal */
export const createDefaultNativePlatform = (props: DefaultNativePlatformProps): new () => NativePlatformDefinition => {
  // note the implementation is constructed here to make PresentationManager
  // usable without loading the actual addon (if addon is set to something other)
  return class implements NativePlatformDefinition {
    private _nativeAddon: IModelJsNative.ECPresentationManager;
    public constructor() {
      const mode = (props.mode === PresentationManagerMode.ReadOnly) ? IModelJsNative.ECPresentationManagerMode.ReadOnly : IModelJsNative.ECPresentationManagerMode.ReadWrite;
      this._nativeAddon = new IModelHost.platform.ECPresentationManager(props.id, props.localeDirectories, props.taskAllocationsMap, mode, props.isChangeTrackingEnabled, props.cacheDirectory);
    }
    private getStatus(responseStatus: IModelJsNative.ECPresentationStatus): PresentationStatus {
      switch (responseStatus) {
        case IModelJsNative.ECPresentationStatus.InvalidArgument: return PresentationStatus.InvalidArgument;
        case IModelJsNative.ECPresentationStatus.Canceled: return PresentationStatus.Canceled;
        default: return PresentationStatus.Error;
      }
    }
    private handleResult<T>(response: IModelJsNative.ErrorStatusOrResult<IModelJsNative.ECPresentationStatus, T>): T {
      if (!response)
        throw new PresentationError(PresentationStatus.InvalidResponse);
      if (response.error)
        throw new PresentationError(this.getStatus(response.error.status), response.error.message);
      return response.result!;
    }
    private handleVoidResult(response: IModelJsNative.ErrorStatusOrResult<IModelJsNative.ECPresentationStatus, void>): void {
      if (!response)
        throw new PresentationError(PresentationStatus.InvalidResponse);
      if (response.error)
        throw new PresentationError(this.getStatus(response.error.status), response.error.message);
    }
    public dispose() {
      this._nativeAddon.dispose();
    }
    public async forceLoadSchemas(db: any): Promise<void> {
      const requestContext = ClientRequestContext.current;
      return new Promise((resolve: () => void, reject: () => void) => {
        requestContext.enter();
        this._nativeAddon.forceLoadSchemas(db, (result: IModelJsNative.ECPresentationStatus) => {
          if (result === IModelJsNative.ECPresentationStatus.Success)
            resolve();
          else
            reject();
        });
      });
    }
    public setupRulesetDirectories(directories: string[]): void {
      this.handleVoidResult(this._nativeAddon.setupRulesetDirectories(directories));
    }
    public setupSupplementalRulesetDirectories(directories: string[]): void {
      this.handleVoidResult(this._nativeAddon.setupSupplementalRulesetDirectories(directories));
    }
    public getImodelAddon(imodel: IModelDb): any {
      if (!imodel.nativeDb)
        throw new PresentationError(PresentationStatus.InvalidArgument, "imodel");
      return imodel.nativeDb;
    }
    public getRulesets(rulesetId: string): string {
      return this.handleResult(this._nativeAddon.getRulesets(rulesetId));
    }
    public addRuleset(serializedRulesetJson: string): string {
      return this.handleResult(this._nativeAddon.addRuleset(serializedRulesetJson));
    }
    public removeRuleset(rulesetId: string, hash: string): boolean {
      return this.handleResult(this._nativeAddon.removeRuleset(rulesetId, hash));
    }
    public clearRulesets(): void {
      this.handleVoidResult(this._nativeAddon.clearRulesets());
    }
    public async handleRequest(db: any, options: string): Promise<string> {
      const requestContext = ClientRequestContext.current;
      const requestGuid = this.handleResult(this._nativeAddon.queueRequest(db, options));
      return new Promise((resolve, reject) => {
        requestContext.enter();
        const interval = setInterval(() => {
          const pollResult = this._nativeAddon.pollResponse(requestGuid);
          if (pollResult.error) {
            if (pollResult.error.status !== IModelJsNative.ECPresentationStatus.Pending) {
              reject(new PresentationError(this.getStatus(pollResult.error.status), pollResult.error.message));
              clearInterval(interval);
            }
            return; // ignore 'pending' responses
          }
          resolve(pollResult.result);
          clearInterval(interval);
        }, 20);
      });
    }
    public getRulesetVariableValue(rulesetId: string, variableId: string, type: VariableValueTypes): VariableValueJSON {
      return this.handleResult(this._nativeAddon.getRulesetVariableValue(rulesetId, variableId, type));
    }
    public setRulesetVariableValue(rulesetId: string, variableId: string, type: VariableValueTypes, value: VariableValueJSON): void {
      this.handleVoidResult(this._nativeAddon.setRulesetVariableValue(rulesetId, variableId, type, value));
    }
    public getUpdateInfo() {
      return this.handleResult(this._nativeAddon.getUpdateInfo());
    }
  };
};
