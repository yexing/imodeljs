/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

import { Viewport } from "@bentley/imodeljs-frontend";
import { DiagnosticsPanel, createButton } from "@bentley/frontend-devtools";
import { ToolBarDropDown } from "./ToolBar";

export class DebugPanel extends ToolBarDropDown {
  private readonly _viewport: Viewport;
  private readonly _panel: DiagnosticsPanel;
  private readonly _parentElement: HTMLElement;
  private get _element(): HTMLElement { return this._panel.element; }

  public constructor(vp: Viewport, parentElement: HTMLElement) {
    super();
    this._viewport = vp;
    this._panel = new DiagnosticsPanel(this._viewport);

    this._parentElement = parentElement;
    this._panel.element.className = "debugPanel";

    const togglePinnedButton = createButton({
      parent: this._element,
      inline: true,
      value: "Pin",
      handler: (item) => {
        this.togglePinnedState();

        if (item.value === "Pin") {
          item.value = "Pinned";
          item.style.border = "inset";
        } else {
          item.value = "Pin";
          item.style.border = "";
        }
      },
    });
    togglePinnedButton.div.style.cssFloat = "right";

    parentElement.appendChild(this._element);
    this._panel.keyinField.focus();
  }

  public dispose(): void {
    this._parentElement.removeChild(this._element);
    this._panel.dispose();
  }

  public get isOpen(): boolean { return "none" !== this._element.style.display; }
  protected _open(): void {
    this._element.style.display = "block";
    this._panel.keyinField.focus();
  }

  protected _close(): void { this._element.style.display = "none"; }
}