import BN from "bn.js";
import { BinaryReader } from 'near-api-js/lib/utils/serialize';
import { TransferInformation, VestingInformation } from "../types/types";
export declare const saturatingSub: (a: BN, b: BN) => BN;
export declare const readOption: (reader: BinaryReader) => string;
/**
 *
 * @param info {@link VestingInformation}.
 * @returns string | undefined.
 */
export declare const formatVestingInfo: (info: VestingInformation) => string | undefined;
/**
 *
 * @param releaseDuration BN.
 * @returns BN.
 */
export declare const formatReleseDuration: (releaseDuration: BN) => BN;
/**
 *
 * @param lockupDuration
 * @param lockupTimestamp
 * @param hasBrokenTimestamp
 * @returns timestamp.
 */
export declare const getStartLockupTimestamp: (lockupDuration: BN, lockupTimestamp: BN, hasBrokenTimestamp: boolean) => BN;
/**
 *
 * @param reader {@link BinaryReader}.
 * @returns one of {@link VestingInformation} or undefined.
 */
export declare const getVestingInformation: (reader: BinaryReader) => VestingInformation;
/**
 *
 * @param reader {@link BinaryReader}.
 * @returns one of {@link TransferInformation}.
 */
export declare const getTransferInformation: (reader: BinaryReader) => TransferInformation;
