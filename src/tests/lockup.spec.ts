import test from "ava";

import { lookupLockup, viewLockupAccount, viewLockupState } from "../lib/lockup";

const testLockupAccountId = "05cf32355756bec4d48664d322130881a4ca289c.lockup.near";

test("view state of lockup account", async (t) => {
  await viewLockupState(testLockupAccountId);
  t.pass();
});

test("view balance and state of lockup account", async (t) => {
  await lookupLockup(testLockupAccountId);
  t.pass();
});

test("view all info abount lockup account", async (t) => {
  await viewLockupAccount(testLockupAccountId);
  t.pass();
});
