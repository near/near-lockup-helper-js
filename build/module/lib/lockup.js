import BN from "bn.js";
import * as nearAPI from "near-api-js";
import { BinaryReader } from "near-api-js/lib/utils/serialize";
import { getLockedTokenAmount } from "./balance";
import { nearApi } from "./near";
import { formatReleseDuration, formatVestingInfo, getStartLockupTimestamp, getTransferInformation, getVestingInformation, readOption } from "./utils";
export const viewLockupState = async (contractId) => {
    const near = await nearApi();
    const lockupAccountCodeHash = (await (await near.account(contractId)).state()).code_hash;
    const result = await near.connection.provider.query({
        request_type: "view_state",
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
        '3kVY9qcVRoW3B5498SMX6R3rtSLiCdmBzKs7zcnzDJ7Q',
        'DiC9bKCqUHqoYqUXovAnqugiuntHWnM3cAc7KrgaHTu'
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
        hasBrokenTimestamp
    };
};
/**
 *
 * @param accountId near lockup accountId used to interact with the network.
 */
export const lookupLockup = async (accountId) => {
    try {
        const lockupAccount = await (await nearApi()).account(accountId);
        const [lockupAccountBalance, lockupState] = await Promise.all([
            lockupAccount.viewFunction(accountId, 'get_balance', {}),
            viewLockupState(accountId)
        ]);
        return { lockupAccountBalance, lockupState };
    }
    catch (error) {
        console.warn(error);
        console.error(`${accountId} doesn't exist`);
        return undefined;
    }
};
/**
* @param lockupAccountId - near lockup accountId used to interact with the network.
*/
export async function viewLockupAccount(lockupAccountId) {
    const near = await nearApi();
    try {
        const account = await near.account(lockupAccountId);
        const ownerAccountBalance = (await account.state()).amount;
        const { lockupAccountBalance, lockupState } = await lookupLockup(lockupAccountId);
        if (lockupState) {
            const { releaseDuration, vestingInformation, ...restLockupState } = lockupState;
            const lockupReleaseStartTimestamp = getStartLockupTimestamp(lockupState.lockupDuration, lockupState.lockupTimestamp, lockupState.hasBrokenTimestamp);
            const lockedAmount = await getLockedTokenAmount(lockupState);
            return {
                lockupAccountId,
                ownerAccountBalance: nearAPI.utils.format.formatNearAmount(ownerAccountBalance, 2),
                lockedAmount: nearAPI.utils.format.formatNearAmount(lockedAmount.toString(), 2),
                liquidAmount: nearAPI.utils.format.formatNearAmount(new BN(lockupAccountBalance).sub(new BN(lockedAmount)).toString(), 2),
                totalAmount: nearAPI.utils.format.formatNearAmount(new BN(ownerAccountBalance).add(new BN(lockupAccountBalance)).toString(), 2),
                lockupReleaseStartDate: new Date(lockupReleaseStartTimestamp.divn(1000000).toNumber()),
                lockupState: {
                    ...restLockupState,
                    releaseDuration: formatReleseDuration(releaseDuration),
                    vestedInfo: formatVestingInfo(vestingInformation)
                },
            };
        }
    }
    catch (error) {
        console.error(error);
    }
    return undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ja3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9sb2NrdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3ZCLE9BQU8sS0FBSyxPQUFPLE1BQU0sYUFBYSxDQUFDO0FBRXZDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUkvRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDakQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEVBQ0wsb0JBQW9CLEVBQ3BCLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsc0JBQXNCLEVBQ3RCLHFCQUFxQixFQUNyQixVQUFVLEVBQ1gsTUFBTSxTQUFTLENBQUM7QUFFakIsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLEtBQUssRUFBRSxVQUFrQixFQUF3QixFQUFFO0lBQ2hGLE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTyxFQUFFLENBQUM7SUFDN0IsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUV6RixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBa0I7UUFDbkUsWUFBWSxFQUFFLFlBQVk7UUFDMUIsUUFBUSxFQUFFLE9BQU87UUFDakIsVUFBVSxFQUFFLFVBQVU7UUFDdEIsYUFBYSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7S0FDaEUsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMs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