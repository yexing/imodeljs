/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Color
 */

import "./ColorPickerButton.scss";
import classnames from "classnames";
import * as React from "react";
import { ColorByName, ColorDef } from "@bentley/imodeljs-common";
import { RelativePosition } from "@bentley/ui-abstract";
import { CommonProps, Popup, useRefs } from "@bentley/ui-core";
import { ColorSwatch } from "./Swatch";

// cSpell:ignore colorpicker

function ColorOptions({ handleColorPicked, options, numColumns, round, title }: { handleColorPicked: ((color: ColorDef) => void), options: ColorDef[], numColumns: number, round: boolean, title?: string }) {
  const containerStyle: React.CSSProperties = { gridTemplateColumns: `repeat(${numColumns}, 1fr)` };
  return (
    <div className="components-colorpicker-popup-container">
      {title && <h4>{title}</h4>}
      <div data-testid="components-colorpicker-popup-colors" className="components-colorpicker-popup-colors" style={containerStyle}>
        {options.map((color, index) => <ColorSwatch className="components-colorpicker-swatch" key={index} colorDef={color}
          onColorPick={handleColorPicked} round={round} />)}
      </div>
    </div>
  );
}

/** Properties for the [[ColorPickerButton]] React component
 * @beta
 */
export interface ColorPickerProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, CommonProps {
  /** Active color */
  initialColor: ColorDef;
  /** Available colors */
  colorDefs?: ColorDef[];
  /** Function to run when user selects color swatch */
  onColorPick?: ((color: ColorDef) => void) | undefined;
  /** Show swatches as squares unless round is set to true */
  round?: boolean;
  /** Disabled or not */
  disabled?: boolean;
  /** Readonly or not */
  readonly?: boolean;
  /** Title to show at top of DropDown */
  dropDownTitle?: string;
  /** Number of columns */
  numColumns?: number;
}

/** ColorPickerButton component
 * @note Using forwardRef so the ColorEditor (Type Editor) can access the ref of the button element inside this component.
 * @beta
 */
export const ColorPickerButton = React.forwardRef<HTMLButtonElement, ColorPickerProps>(
  function ColorPickerButton(props, ref) {
    const target = React.useRef<HTMLButtonElement>(null);
    const refs = useRefs(target, ref);  // combine ref needed for target with the forwardRef needed by the Parent when parent is a Type Editor.
    const [showPopup, setShowPopup] = React.useState(false);
    const [colorDef, setColorDef] = React.useState(props.initialColor);

    const defaultColors = React.useRef(
      [
        ColorDef.create(ColorByName.red),
        ColorDef.create(ColorByName.orange),
        ColorDef.create(ColorByName.yellow),
        ColorDef.create(ColorByName.green),
        ColorDef.create(ColorByName.blue),
        ColorDef.create(ColorByName.indigo),
        ColorDef.create(ColorByName.violet),
        ColorDef.create(ColorByName.black),
        ColorDef.create(ColorByName.white),
        ColorDef.create(ColorByName.cyan),
        ColorDef.create(ColorByName.fuchsia),
        ColorDef.create(ColorByName.tan),
        ColorDef.create(ColorByName.gray),
        ColorDef.create(ColorByName.brown),
        ColorDef.create(ColorByName.purple),
        ColorDef.create(ColorByName.olive),
      ]);

    const closePopup = React.useCallback(() => {
      setShowPopup(false);
    }, []);

    const togglePopup = React.useCallback(() => {
      setShowPopup(!showPopup);
    }, [showPopup]);

    const handleColorPicked = React.useCallback((color: ColorDef) => {
      closePopup();

      if (!color.equals(colorDef)) {
        setColorDef(color);

        // istanbul ignore else
        if (props.onColorPick)
          props.onColorPick(color);
      }
    }, [closePopup, colorDef, props]);

    const { b, g, r, t } = colorDef.colors;
    const rgbaString = `rgb(${r},${g},${b},${(255 - t) / 255})`;

    const buttonStyle = { backgroundColor: rgbaString, ...props.style } as React.CSSProperties;
    const buttonClassNames = classnames("components-colorpicker-button",
      props.round && "round",
      props.readonly && "readonly",
      props.className,
    );

    const colorOptions = props.colorDefs && props.colorDefs.length ? props.colorDefs : defaultColors.current;
    return (
      <>
        <button data-testid="components-colorpicker-button" onClick={togglePopup} className={buttonClassNames} style={buttonStyle} disabled={props.disabled} ref={refs} />
        <Popup
          className="components-colorpicker-popup"
          isOpen={showPopup}
          position={RelativePosition.BottomLeft}
          onClose={closePopup}
          target={target.current} >
          <ColorOptions handleColorPicked={handleColorPicked} options={colorOptions} numColumns={props.numColumns ? props.numColumns : 4} round={!!props.round} title={props.dropDownTitle} />
        </Popup>
      </>
    );
  });
