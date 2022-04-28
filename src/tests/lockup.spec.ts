/* eslint-disable functional/no-loop-statement */
import test from "ava";

import {
  getLockupAccountBalance,
  viewLockupAccount,
  viewLockupState,
} from "../lib/lockup";

import { lockupAccountSnapshots } from "./snapshots";

test("view state of lockup account", async (t) => {
  await viewLockupState(lockupAccountSnapshots[1].lockupAccountId);
  t.pass();
});

test("view account balance", async (t) => {
  await getLockupAccountBalance(lockupAccountSnapshots[1].lockupAccountId);
  t.pass();
});

test("view all info about lockup account on 'finality' block", async (t) => {
  await viewLockupAccount(lockupAccountSnapshots[1].lockupAccountId);
  t.pass();
});

test("view all info about account on particular block using arhival credencials", async (t) => {
  const items = lockupAccountSnapshots.length;
  t.plan(items);
  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < items; i++) {
    const res = await viewLockupAccount(
      lockupAccountSnapshots[i].lockupAccountId,
      { nodeUrl: "https://archival-rpc.mainnet.near.org" },
      { block_id: lockupAccountSnapshots[i].calculatedAtBlockHeight }
    );
    t.deepEqual(
      lockupAccountSnapshots[i],
      res,
      `i=${i}\nTotal:\n${res.totalAmount.toString()}\n${lockupAccountSnapshots[
        i
      ].totalAmount.toString()}\nLiquid:\n${res.liquidAmount.toString()}\n${lockupAccountSnapshots[
        i
      ].liquidAmount.toString()}`
    );
  }
});
