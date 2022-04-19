import BN from "bn.js";
import * as nearAPI from "near-api-js";
import { ConnectConfig } from "near-api-js/lib/connect";
import { CodeResult } from "near-api-js/lib/providers/provider";
import { BinaryReader } from "near-api-js/lib/utils/serialize";

import {
  AccountLockup,
  BlockReference,
  LockupState,
  ViewAccount,
  ViewAccountQuery,
  ViewStateResult
} from "../types/types";

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
 * @param nearConfig specify custom connection to NEAR network.
 * @param blockReference specify block {@link BlockReference} of calculated data. Default is `{ finality: "final" }`.
 * @returns state of lockup account {@link LockupState}.
 */
export const viewLockupState = async (
  contractId: string,
  nearConfig?: ConnectConfig,
  blockReference: BlockReference = { finality: "final" }
): Promise<LockupState> => {
  const near = await nearApi(nearConfig);
  const accountCalcutationInfo = await viewAccountBalance(
    contractId,
    nearConfig,
    blockReference
  );
  const lockupAccountCodeHash = accountCalcutationInfo.codeHash;

  const result = await near.connection.provider.query<ViewStateResult>({
    request_type: "view_state",
    ...blockReference,
    account_id: contractId,
    prefix_base64: Buffer.from("STATE", "utf-8").toString("base64"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  const blockTimestamp = (await near.connection.provider.block(
    { blockId: accountCalcutationInfo.blockHeight }
  )).header.timestamp_nanosec;

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
    blockTimestamp: new BN(blockTimestamp),
    transferInformation,
    vestingInformation,
    hasBrokenTimestamp,
  };
};

/**
 * View current balance with balance sended for staking.
 * @param contractId near lockup accountId used to interact with the network.
 * @param nearConfig specify custom connection to NEAR network.
 * @param blockReference specify block of calculated data.
 * @returns
 */
export const getAccountBalance = async (
  contractId: string,
  nearConfig?: ConnectConfig,
  blockReference: BlockReference = { finality: "final" }
): Promise<string | null> => {
  const near = await nearApi(nearConfig);
  const serializedArgs = Buffer.from(JSON.stringify({})).toString("base64");
  try {
    const result = await near.connection.provider.query<CodeResult>({
      request_type: 'call_function',
      account_id: contractId,
      method_name: "get_balance",
      args_base64: serializedArgs,
      ...blockReference
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    return result.result &&
      result.result.length > 0 &&
      JSON.parse(Buffer.from(result.result).toString()) || null;
  } catch (error) {
    console.error("getAccountBalance failed to fetch data due to:", error);
  }
  return null;
};

/**
 * View balance and state of lockup account.
 * @param accountId near lockup account owner id used to interact with the network.
 * @param nearConfig specify custom connection to NEAR network.
 * @param blockReference specify block of calculated data.
 * @returns account codeHash and balance calculated at particular block {@link ViewAccount}.
 */
export const viewAccountBalance = async (
  accountId: string,
  nearConfig?: ConnectConfig,
  blockReference: BlockReference = { finality: "final" }
  ): Promise<ViewAccount | null> => {
  const near = await nearApi(nearConfig);

  try {
    const viewAccount = await near.connection.provider.query<ViewAccountQuery>({
      request_type: "view_account",
      ...blockReference,
      account_id: accountId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    return {
      amount: viewAccount.amount,
      codeHash: viewAccount.code_hash,
      blockHeight: viewAccount.block_height,
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};

/**
 * View all information about lockup account.
 * @param lockupAccountId near lockup accountId used to interact with the network.
 * @param nearConfig specify custom connection to NEAR network.
 * @param blockReference specify block of calculated data.
 * @returns lockup account information {@link AccountLockup}.
 */
export const viewLockupAccount = async (
  lockupAccountId: string,
  nearConfig?: ConnectConfig,
  blockReference?: BlockReference
): Promise<AccountLockup | null> => {
  try {
    const [lockupAccountBalance, lockupState] = await Promise.all([
      getAccountBalance(lockupAccountId, nearConfig, blockReference),
      viewLockupState(lockupAccountId, nearConfig, blockReference),
    ]);

    if (lockupState) {
      const { releaseDuration, vestingInformation, ...restLockupState } =
        lockupState;
      const lockupReleaseStartTimestamp = getStartLockupTimestamp(
        lockupState.lockupDuration,
        lockupState.lockupTimestamp,
        lockupState.hasBrokenTimestamp
      );
      const lockedAmount = getLockedTokenAmount(lockupState);

      const {
        amount: ownerAccountBalance,
        blockHeight: calculatedAtBlockHeight
      } = await viewAccountBalance(
        lockupState.owner,
        nearConfig,
        blockReference
      );

      return {
        lockupAccountId,
        calculatedAtBlockHeight,
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
  return null;
};
