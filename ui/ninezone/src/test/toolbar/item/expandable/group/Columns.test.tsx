/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { mount, shallow } from "enzyme";
import * as React from "react";
import { Columns } from "../../../../../ui-ninezone";

describe("<Columns />", () => {
  it("should render", () => {
    mount(<Columns />);
  });

  it("renders correctly", () => {
    shallow(<Columns />).should.matchSnapshot();
  });
});
