import BN from "bn.js";
import * as nearAPI from "near-api-js";
import { BlockReference, ViewStateResult } from "near-api-js/lib/providers/provider";
import { BinaryReader } from "near-api-js/lib/utils/serialize";

import { AccountLockup, Lockup, LockupState } from "../types/types";

import { getLockedTokenAmount } from "./balance";
import { nearApi } from "./near";
import {
  formatReleseDuration,
  formatVestingInfo,
  getStartLockupTimestamp,
  getTransferInformation,
  getVestingInformation,
  readOption,
} from "./utils";

/**
 * View state of lockup account
 * @param contractId near lockup accountId used to interact with the network.
 * @param blockReference specify block {@link BlockReference}. Default is `{ finality: "final" }`.
 * @returns state of lockup account {@link LockupState}.
 */
export const viewLockupState = async (
  contractId: string,
  blockReference: BlockReference = { finality: "final" }
): Promise<LockupState> => {
  const near = await nearApi();
  const lockupAccountCodeHash = (await (await near.account(contractId)).state())
    .code_hash;

  const result = await near.connection.provider.query<ViewStateResult>({
    request_type: "view_state",
    ...blockReference,
    finality: "final",
    account_id: contractId,
    prefix_base64: Buffer.from("STATE", "utf-8").toString("base64"),
  });
  const value = Buffer.from(result.values[0].value, "base64");
  const reader = new BinaryReader(value);
  const owner = reader.readString();
  const lockupAmount = reader.readU128().toString();
  const terminationWithdrawnTokens = reader.readU128().toString();
  const lockupDuration = reader.readU64().toString();
  const releaseDuration = readOption(reader);
  const lockupTimestamp = readOption(reader);
  // More details: https://github.com/near/core-contracts/pull/136
  const hasBrokenTimestamp = [
    "3kVY9qcVRoW3B5498SMX6R3rtSLiCdmBzKs7zcnzDJ7Q",
    "DiC9bKCqUHqoYqUXovAnqugiuntHWnM3cAc7KrgaHTu",
  ].includes(lockupAccountCodeHash);

  const transferInformation = getTransferInformation(reader);
  const vestingInformation = getVestingInformation(reader);

  return {
    owner,
    lockupAmount: new BN(lockupAmount),
    terminationWithdrawnTokens: new BN(terminationWithdrawnTokens),
    lockupDuration: new BN(lockupDuration),
    releaseDuration: new BN(releaseDuration),
    lockupTimestamp: new BN(lockupTimestamp),
    transferInformation,
    vestingInformation,
    hasBrokenTimestamp,
  };
};

/**
 * View balance and state of lockup account.
 * @param accountId near lockup accountId used to interact with the network.
 */
export const lookupLockup = async (
  accountId: string
): Promise<Lockup> | undefined => {
  try {
    const lockupAccount = await (await nearApi()).account(accountId);
    const [lockupAccountBalance, lockupState] = await Promise.all([
      lockupAccount.viewFunction(accountId, "get_balance", {}),
      viewLockupState(accountId),
    ]);

    return { lockupAccountBalance, lockupState };
  } catch (error) {
    console.warn(error);
    console.error(`${accountId} doesn't exist`);
    return undefined;
  }
};

/**
 * View all information about lockup account.
 * @param lockupAccountId - near lockup accountId used to interact with the network.
 * @returns lockup account information {@link AccountLockup}
 */
export const viewLockupAccount = async (
  lockupAccountId: string
): Promise<AccountLockup> => {
  const near = await nearApi();

  try {
    const account = await near.account(lockupAccountId);
    const ownerAccountBalance = (await account.state()).amount;
    const { lockupAccountBalance, lockupState } = await lookupLockup(
      lockupAccountId
    );

    if (lockupState) {
      const { releaseDuration, vestingInformation, ...restLockupState } =
        lockupState;
      const lockupReleaseStartTimestamp = getStartLockupTimestamp(
        lockupState.lockupDuration,
        lockupState.lockupTimestamp,
        lockupState.hasBrokenTimestamp
      );
      const lockedAmount = await getLockedTokenAmount(lockupState);

      return {
        lockupAccountId,
        ownerAccountBalance: nearAPI.utils.format.formatNearAmount(
          ownerAccountBalance,
          2
        ),
        lockedAmount: nearAPI.utils.format.formatNearAmount(
          lockedAmount.toString(),
          2
        ),
        liquidAmount: nearAPI.utils.format.formatNearAmount(
          new BN(lockupAccountBalance).sub(new BN(lockedAmount)).toString(),
          2
        ),
        totalAmount: nearAPI.utils.format.formatNearAmount(
          new BN(ownerAccountBalance)
            .add(new BN(lockupAccountBalance))
            .toString(),
          2
        ),
        lockupReleaseStartDate: new Date(
          lockupReleaseStartTimestamp.divn(1000000).toNumber()
        ),
        lockupState: {
          ...restLockupState,
          releaseDuration: formatReleseDuration(releaseDuration),
          vestedInfo: formatVestingInfo(vestingInformation),
        },
      };
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
};
