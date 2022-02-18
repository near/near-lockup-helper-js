import BN from "bn.js";

export type LockupState = {
  readonly owner: string;
  readonly lockupAmount: BN;
  readonly terminationWithdrawnTokens: BN;
  readonly lockupDuration: BN;
  readonly releaseDuration?: BN;
  readonly lockupTimestamp?: BN;
  readonly transferInformation: TransferInformation;
  readonly vestingInformation?: VestingInformation;
  readonly hasBrokenTimestamp: boolean;
};

export type Lockup = {
  readonly lockupAccountBalance: string;
  readonly lockupState: LockupState;
};

export type AccountLockup = {
  readonly lockupAccountId: string;
  readonly ownerAccountBalance: string;
  readonly lockedAmount: string;
  readonly liquidAmount: string;
  readonly totalAmount: string;
  readonly lockupReleaseStartDate: Date;
  readonly lockupState: LockupState & {
    readonly vestedInfo: string;
  };
};

export type TransferInformation = {
  readonly transfers_timestamp?: BN;
  readonly transfer_poll_account_id?: string;
};

export type VestingInformation = {
  readonly vestingHash?: readonly unknown[];
  readonly start?: BN;
  readonly cliff?: BN;
  readonly end?: BN;
  readonly unvestedAmount?: BN;
  readonly terminationStatus?: number;
};
