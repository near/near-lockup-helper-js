import test from "ava";

import { lookupLockup, viewLockupAccount, viewLockupState } from "../lib/lockup";

// import { lockupDataMock } from "./mock";

const testLockupAccountId = "05cf32355756bec4d48664d322130881a4ca289c.lockup.near";

test("view state of lockup account", async (t) => {
  await viewLockupState(testLockupAccountId);
  t.pass();
});

test("view balance and state of lockup account", async (t) => {
  await lookupLockup(testLockupAccountId);
  t.pass();
});

test("view all info about lockup account", async (t) => {
  await viewLockupAccount(testLockupAccountId);
  t.pass();
});

// test("view all info about lockup account on particular block", async (t) => {
//   const res = await viewLockupAccount(
//     testLockupAccountId,
//     null,
//     { blockId: 59930498 }
//   );
//   t.is(res, lockupDataMock);
// });
