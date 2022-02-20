import BN from "bn.js";
import * as nearAPI from "near-api-js";

import { AccountLockup } from "../types/types";

export const lockupDataMock: AccountLockup = {
  lockupAccountId: "05cf32355756bec4d48664d322130881a4ca289c.lockup.near",
  ownerAccountBalance: "37.04",
  lockedAmount: nearAPI.utils.format.formatNearAmount(
    new BN("292377553668402855804267977390").toString(),
    2
  ),
  liquidAmount: nearAPI.utils.format.formatNearAmount(
    new BN("657787042560574010285992772541")
    .sub(new BN("292377553668402855804267977390"))
    .toString(),
    2
  ),
  totalAmount: "657,824.09",
  lockupReleaseStartDate: new Date(new BN("1602614338293769340").divn(1000000).toNumber()),
  lockupState: {
    owner: '567a69e5ee660392866f7540d2dc6e9b99fea9e5926b0021e7eca86049802e1d',
    lockupAmount: new BN("1000000000000000000000000000000"),
    terminationWithdrawnTokens: new BN("368434741024720400157172915557"),
    lockupDuration: new BN("31536000000000000"),
    lockupTimestamp: new BN(0),
    hasBrokenTimestamp: true,
    releaseDuration: new BN("1460"),
    vestingInformation: undefined,
    vestedInfo: undefined,
    transferInformation: {
      transfers_timestamp: new BN("1602614338293769340")
    }
  }
};
