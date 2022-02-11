import BN from "bn.js";
import { LockupState } from "../types/types";
/**
 * For reference @link https://github.com/near/core-contracts/blob/master/lockup/src/getters.rs#L64
 * @param lockupState {@link LockupState}
 * @returns BN
 */
export declare const getLockedTokenAmount: (lockupState: LockupState) => Promise<BN>;
