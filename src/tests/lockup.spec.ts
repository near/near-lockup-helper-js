import test from "ava";

import { lookupLockup, viewLockupAccount, viewLockupState } from "../lib/lockup";
import { connectOptions } from "../lib/near";

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
  const arhivalConfig = {
    nodeUrl: "https://archival-rpc.mainnet.near.org",
    networkId: "mainnet",
    keyStore: connectOptions.keyStore,
    headers: connectOptions.headers
  };

  const res = await viewLockupAccount(
    lockupDataMock[1].lockupAccountId,
    arhivalConfig,
    { block_id: 59976515 }
  );
  t.deepEqual(res, lockupDataMock[1]);
});

test("view all info about account on particular block using arhival credencials", async (t) => {
  const arhivalConfig = {
    nodeUrl: "https://archival-rpc.mainnet.near.org",
    networkId: "mainnet",
    keyStore: connectOptions.keyStore,
    headers: connectOptions.headers
  };
  const res = await viewLockupAccount(
    lockupDataMock[2].lockupAccountId,
    arhivalConfig,
    { block_id: 26490580 }
  );
  t.deepEqual(res, lockupDataMock[2]);
});
