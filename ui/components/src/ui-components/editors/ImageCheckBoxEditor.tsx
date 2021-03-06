/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module PropertyEditors
 */

import "./ImageCheckBoxEditor.scss";
import classnames from "classnames";
import * as React from "react";
import {
  ImageCheckBoxParams, PropertyEditorParams, PropertyEditorParamTypes, PropertyValue, PropertyValueFormat, StandardEditorNames, StandardTypeNames,
} from "@bentley/ui-abstract";
import { PropertyEditorProps, TypeEditor } from "./EditorContainer";
import { PropertyEditorBase, PropertyEditorManager } from "./PropertyEditorManager";
import { ImageCheckBox } from "@bentley/ui-core";

/** @internal */
interface ImageCheckBoxEditorState {
  /** Image for the "checked" state */
  imageOn: string;
  /** Image for the "unchecked" (default) state */
  imageOff: string;
  checkboxValue: boolean;
}
/** [[ImageCheckBoxEditor]]
 * Boolean editor that renders with an image instead of checkbox
 * @beta
 */
export class ImageCheckBoxEditor extends React.PureComponent<PropertyEditorProps, ImageCheckBoxEditorState> implements TypeEditor {

  private _isMounted = false;
  /** @internal */

  public readonly state: Readonly<ImageCheckBoxEditorState> = {
    imageOff: "",
    imageOn: "",
    checkboxValue: false,
  };
  public async getPropertyValue(): Promise<PropertyValue | undefined> {
    const record = this.props.propertyRecord;
    let propertyValue: PropertyValue | undefined;

    // istanbul ignore else
    if (record && record.value.valueFormat === PropertyValueFormat.Primitive) {
      propertyValue = {
        valueFormat: PropertyValueFormat.Primitive,
        value: this.state.checkboxValue,
        displayValue: "",
      };
    }

    return propertyValue;
  }

  /** @internal */
  public componentDidMount() {
    this._isMounted = true;
    this.setStateFromProps();
  }

  /** @internal */
  public componentWillUnmount() {
    this._isMounted = false;
  }

  /** @internal */
  public componentDidUpdate(prevProps: PropertyEditorProps) {
    if (this.props.propertyRecord !== prevProps.propertyRecord) {
      this.setStateFromProps();
    }
  }

  private setStateFromProps() {
    const { propertyRecord } = this.props;
    let checkboxValue = false;
    let imageOn = "";
    let imageOff = "";

    // istanbul ignore else
    if (propertyRecord && propertyRecord.value.valueFormat === PropertyValueFormat.Primitive) {
      const primitiveValue = propertyRecord.value.value;
      checkboxValue = primitiveValue as boolean;
    }

    if (propertyRecord && propertyRecord.property && propertyRecord.property.editor && propertyRecord.property.editor.params) {
      const imageCheckBoxParams = propertyRecord.property.editor.params.find((param: PropertyEditorParams) => param.type === PropertyEditorParamTypes.CheckBoxImages) as ImageCheckBoxParams;
      // istanbul ignore else
      if (imageCheckBoxParams) {
        if (imageCheckBoxParams.imageOn)
          imageOn = imageCheckBoxParams.imageOn;
        if (imageCheckBoxParams.imageOff)
          imageOff = imageCheckBoxParams.imageOff;
      }
    }
    this.setState({ imageOn, imageOff, checkboxValue });
  }

  private _handleClick = (checked: boolean) => {
    this.setState({
      checkboxValue: checked,
    }, async () => {
      // istanbul ignore else
      if (this.props.propertyRecord && this.props.onCommit) {
        const propertyValue = await this.getPropertyValue();
        // istanbul ignore else
        if (this._isMounted && propertyValue !== undefined) {
          this.props.onCommit({ propertyRecord: this.props.propertyRecord, newValue: propertyValue });
        }
      }
    });
  }

  public render() {
    const className = classnames("components-cell-editor", "components-imagecheckbox-editor", this.props.className);
    const checked = this.state.checkboxValue;

    return (
      <ImageCheckBox
        imageOff={this.state.imageOff}
        imageOn={this.state.imageOn}
        className={className}
        border={true}
        style={this.props.style}
        checked={checked}
        onClick={this._handleClick}
        data-testid="components-imagecheckbox-editor">
      </ImageCheckBox>
    );
  }
}

/** ImageCheckBox Property Editor registered for the "bool" and "boolean" type names.
 * It uses the [[ImageCheckBoxEditor]] React component.
 * @beta
 */
export class ImageCheckBoxPropertyEditor extends PropertyEditorBase {
  public get reactNode(): React.ReactNode {
    return <ImageCheckBoxEditor />;
  }
}

PropertyEditorManager.registerEditor(StandardTypeNames.Boolean, ImageCheckBoxPropertyEditor, StandardEditorNames.ImageCheckBox);
PropertyEditorManager.registerEditor(StandardTypeNames.Bool, ImageCheckBoxPropertyEditor, StandardEditorNames.ImageCheckBox);
