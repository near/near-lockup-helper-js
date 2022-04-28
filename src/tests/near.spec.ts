import test from "ava";

import { nearApi } from "../lib/near";

test("connect to NEAR network", async (t) => {
  await nearApi();
  t.pass();
});
