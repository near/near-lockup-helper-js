import test from "ava";

import { lookupLockup, viewLockupAccount, viewLockupState } from "../lib/lockup";

import { lockupDataMock } from "./mock";

test("view state of lockup account", async (t) => {
  await viewLockupState(lockupDataMock[1].lockupAccountId);
  t.pass();
});

test("view balance and state of lockup account", async (t) => {
  await lookupLockup(lockupDataMock[1].lockupAccountId);
  t.pass();
});

test("view all info about lockup account on 'finality' block", async (t) => {
  await viewLockupAccount(lockupDataMock[1].lockupAccountId);
  t.pass();
});

test("view all info about lockup account on particular block", async (t) => {
  const res = await viewLockupAccount(
    lockupDataMock[1].lockupAccountId,
    null,
    { block_id: 59976515 }
  );
  t.deepEqual(res, lockupDataMock[1]);
});
