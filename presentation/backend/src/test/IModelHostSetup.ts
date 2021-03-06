/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { IModelHost } from "@bentley/imodeljs-backend";

beforeEach(async () => {
  await IModelHost.shutdown();
  try {
    await IModelHost.startup();
  } catch (_e) { }
});
