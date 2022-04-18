/* eslint-disable functional/no-loop-statement */
import test from "ava";

import { lookupLockup, viewLockupAccount, viewLockupState } from "../lib/lockup";
import { connectOptions } from "../lib/near";

import { lockupAccountSnapshots } from "./snapshots";

test("view state of lockup account", async (t) => {
  await viewLockupState(lockupAccountSnapshots[1].lockupAccountId);
  t.pass();
});

test("view balance and state of lockup account", async (t) => {
  await lookupLockup(lockupAccountSnapshots[1].lockupAccountId);
  t.pass();
});

test("view all info about lockup account on 'finality' block", async (t) => {
  await viewLockupAccount(lockupAccountSnapshots[1].lockupAccountId);
  t.pass();
});

test("view all info about account on particular block using arhival credencials", async (t) => {
  const items = lockupAccountSnapshots.length;
  t.plan(items);

  const arhivalConfig = {
    nodeUrl: "https://archival-rpc.mainnet.near.org",
    networkId: "mainnet",
    keyStore: connectOptions.keyStore,
    headers: connectOptions.headers
  };
  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < items; i++) {
    const res = await viewLockupAccount(
      lockupAccountSnapshots[i].lockupAccountId,
      arhivalConfig,
      { block_id: lockupAccountSnapshots[i].calculatedAtBlockHeight }
    );
    t.deepEqual(res, lockupAccountSnapshots[i]);
  }
});
