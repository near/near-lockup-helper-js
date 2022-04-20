import BN from "bn.js";

import { AccountLockup } from "../types/types";

export const lockupAccountSnapshots: readonly AccountLockup[] = [
  {
    lockupAccountId: "05cf32355756bec4d48664d322130881a4ca289c.lockup.near",
    calculatedAtBlockHeight: 59976515,
    ownerAccountBalance: new BN("962852509548862600000000"),
    lockedAmount: new BN("291967651531127749576464831779"),
    liquidAmount: new BN("657787042560574010285992772541").sub(new BN("291967651531127749576464831779")),
    totalAmount: new BN("657788005413083559148592772541"),
    lockupReleaseStartDate: new Date(new BN("1602614338293769340").divn(1000000).toNumber()),
    lockupState: {
      owner: '567a69e5ee660392866f7540d2dc6e9b99fea9e5926b0021e7eca86049802e1d',
      lockupAmount: new BN("1000000000000000000000000000000"),
      terminationWithdrawnTokens: new BN("368434741024720400157172915557"),
      lockupDuration: new BN("31536000000000000"),
      lockupTimestamp: new BN(0),
      hasBrokenTimestamp: true,
      blockTimestamp: new BN("1645452538887204431"),
      releaseDuration: new BN("1460"),
      vestedInfo: null,
      transferInformation: {
        transfers_timestamp: new BN("1602614338293769340")
      }
    }
  },
  {
    lockupAccountId: "84146973a9c419dc97a4a46641b5be70ee7f822e.lockup.near",
    calculatedAtBlockHeight: 59976515,
    ownerAccountBalance: new BN("5008152288560125000000000"),
    lockedAmount: new BN("47090070000000000000000000000"),
    liquidAmount: new BN("47090071464553200113900000000").sub(new BN("47090070000000000000000000000")),
    totalAmount: new BN("47095079616841760238900000000"),
    lockupReleaseStartDate: new Date(new BN("1602614338293769340").divn(1000000).toNumber()),
    lockupState: {
      owner: 'xkv.near',
      lockupAmount: new BN("47090070000000000000000000000"),
      terminationWithdrawnTokens: new BN("0"),
      lockupDuration: new BN("0"),
      lockupTimestamp: new BN(0),
      blockTimestamp: new BN("1645452538887204431"),
      hasBrokenTimestamp: false,
      releaseDuration: new BN("0"),
      vestedInfo: "from Tue Jun 01 2021 19:06:00 GMT+0300 (Eastern European Summer Time) until Sat May 31 2025 06:52:40 GMT+0300 (Eastern European Summer Time) with cliff at Wed Jun 01 2022 20:12:40 GMT+0300 (Eastern European Summer Time)",
      transferInformation: {
        transfers_timestamp: new BN("1602614338293769340")
      }
    }
  },
  {
    lockupAccountId: "80a50388377db2df7399e29d625c3d5b4552a81d.lockup.near",
    calculatedAtBlockHeight: 26490580,
    ownerAccountBalance: new BN("40000015593969661600000000"),
    lockedAmount: new BN("0"),
    liquidAmount: new BN("1900000000023506883760900000000").sub(new BN("0")),
    totalAmount: new BN("1900040000039100853422500000000"),
    lockupReleaseStartDate: new Date(new BN("1602614338293769340").divn(1000000).toNumber()),
    lockupState: {
      owner: 'opgran01.near',
      lockupAmount: new BN("1900000000000000000000000000000"),
      terminationWithdrawnTokens: new BN("0"),
      lockupDuration: new BN("2628000000000000"),
      lockupTimestamp: new BN(0),
      blockTimestamp: new BN("1609455599034863991"),
      hasBrokenTimestamp: true,
      releaseDuration: new BN("0"),
      vestedInfo: "from Tue Aug 25 2020 03:00:00 GMT+0300 (Eastern European Summer Time) until Sun Oct 25 2020 03:00:00 GMT+0300 (Eastern European Summer Time) with cliff at Sun Oct 25 2020 03:00:00 GMT+0300 (Eastern European Summer Time)",
      transferInformation: {
        transfer_poll_account_id: "transfer-vote.near"
      }
    }
  },
];
