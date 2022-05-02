import BN from "bn.js";
import { CodeResult } from "near-api-js/lib/providers/provider";
import { BinaryReader } from "near-api-js/lib/utils/serialize";

import {
  AccountLockup,
  BlockReference,
  ConnectOptions,
  LockupState,
  ViewAccount,
  ViewAccountQuery,
  ViewStateResult,
} from "../types/types";

import { getLockedTokenAmount } from "./balance";
import { nearApi } from "./near";
import {
  formatReleaseDuration,
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
  nearConfig?: ConnectOptions,
  blockReference: BlockReference = { finality: "final" }
): Promise<LockupState> => {
  const near = await nearApi(nearConfig);
  const accountCalculationInfo = await viewAccountBalance(
    contractId,
    nearConfig,
    blockReference
  );
  const lockupAccountCodeHash = accountCalculationInfo.codeHash;

  const result = await near.connection.provider.query<ViewStateResult>({
    request_type: "view_state",
    ...blockReference,
    account_id: contractId,
    prefix_base64: Buffer.from("STATE", "utf-8").toString("base64"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  const blockTimestamp = (
    await near.connection.provider.block({
      blockId: accountCalculationInfo.blockHeight,
    })
  ).header.timestamp_nanosec;

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
 * View lockup account balance including the tokens delegated for staking.
 * @param contractId near lockup accountId used to interact with the network.
 * @param nearConfig specify custom connection to NEAR network.
 * @param blockReference specify block of calculated data.
 * @returns yoctoNEAR amount of tokens
 */
export const getLockupAccountBalance = async (
  contractId: string,
  nearConfig?: ConnectOptions,
  blockReference: BlockReference = { finality: "final" }
): Promise<BN> => {
  const near = await nearApi(nearConfig);
  const delegatedStakingPoolAccountIdResponse =
    await near.connection.provider.query<CodeResult>({
      request_type: "call_function",
      account_id: contractId,
      method_name: "get_staking_pool_account_id",
      args_base64: Buffer.from(JSON.stringify({})).toString("base64"),
      ...blockReference,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  const delegatedStakingPoolAccountId = JSON.parse(
    Buffer.from(delegatedStakingPoolAccountIdResponse.result).toString()
  );
  const accountBalance = await viewAccountBalance(
    contractId,
    nearConfig,
    blockReference
  );
  if (delegatedStakingPoolAccountId) {
    const delegatedStakingBalanceResponse =
      await near.connection.provider.query<CodeResult>({
        request_type: "call_function",
        account_id: delegatedStakingPoolAccountId,
        method_name: "get_account_total_balance",
        args_base64: Buffer.from(
          JSON.stringify({ account_id: contractId })
        ).toString("base64"),
        ...blockReference,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    return new BN(
      JSON.parse(Buffer.from(delegatedStakingBalanceResponse.result).toString())
    ).add(accountBalance.amount);
  }
  return accountBalance.amount;
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
  nearConfig?: ConnectOptions,
  blockReference: BlockReference = { finality: "final" }
): Promise<ViewAccount> => {
  const near = await nearApi(nearConfig);

  const viewAccount = await near.connection.provider.query<ViewAccountQuery>({
    request_type: "view_account",
    ...blockReference,
    account_id: accountId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  return {
    amount: new BN(viewAccount.amount),
    codeHash: viewAccount.code_hash,
    blockHeight: viewAccount.block_height,
  };
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
  nearConfig?: ConnectOptions,
  blockReference?: BlockReference
): Promise<AccountLockup | null> => {
  try {
    const [lockupAccountBalance, lockupState] = await Promise.all([
      getLockupAccountBalance(lockupAccountId, nearConfig, blockReference),
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
        blockHeight: calculatedAtBlockHeight,
      } = await viewAccountBalance(
        lockupState.owner,
        nearConfig,
        blockReference
      );

      return {
        lockupAccountId,
        calculatedAtBlockHeight,
        ownerAccountBalance: new BN(ownerAccountBalance),
        lockedAmount,
        liquidAmount: new BN(lockupAccountBalance).sub(lockedAmount),
        totalAmount: new BN(ownerAccountBalance).add(
          new BN(lockupAccountBalance)
        ),
        lockupReleaseStartDate: new Date(
          lockupReleaseStartTimestamp.divn(1000000).toNumber()
        ),
        lockupState: {
          ...restLockupState,
          releaseDuration: formatReleaseDuration(releaseDuration),
          vestedInfo: formatVestingInfo(vestingInformation),
        },
      };
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};
