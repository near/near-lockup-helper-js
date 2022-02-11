import { AccountLockup, Lockup, LockupState } from "../types/types";
export declare const viewLockupState: (contractId: string) => Promise<LockupState>;
/**
 *
 * @param accountId near lockup accountId used to interact with the network.
 */
export declare const lookupLockup: (accountId: string) => Promise<Lockup> | undefined;
/**
* @param lockupAccountId - near lockup accountId used to interact with the network.
*/
export declare function viewLockupAccount(lockupAccountId: string): Promise<AccountLockup>;
