import BN from "bn.js";
import { getStartLockupTimestamp, saturatingSub } from "./utils";
/**
 *
 * @param releaseDuration release duration
 * @param lockupTimestamp lockup timestamp
 * @param brokenTimestamp is there broken timestamp
 * @param blockTimestamp timestamp of block
 * @param lockupAmount amount
 */
const getUnreleasedAmount = (releaseDuration, lockupTimestamp, brokenTimestamp, blockTimestamp, lockupAmount) => {
    if (releaseDuration) {
        const startTimestamp = getStartLockupTimestamp(releaseDuration, lockupTimestamp, brokenTimestamp);
        const endTimestamp = startTimestamp.add(releaseDuration);
        if (endTimestamp.lt(blockTimestamp)) {
            return new BN(0);
        }
        else {
            const timeLeft = endTimestamp.sub(blockTimestamp);
            return lockupAmount
                .mul(timeLeft)
                .div(releaseDuration);
        }
    }
    else {
        return new BN(0);
    }
};
const getUnvestedAmount = (vestingInformation, blockTimestamp, lockupAmount) => {
    if (vestingInformation) {
        if (vestingInformation.unvestedAmount) {
            // was terminated
            return vestingInformation.unvestedAmount;
        }
        else if (vestingInformation.start) {
            // we have schedule
            if (blockTimestamp.lt(vestingInformation.cliff)) {
                return lockupAmount;
            }
            else if (blockTimestamp.gte(vestingInformation.end)) {
                return new BN(0);
            }
            else {
                const timeLeft = vestingInformation.end.sub(blockTimestamp);
                const totalTime = vestingInformation.end.sub(vestingInformation.start);
                return lockupAmount.mul(timeLeft).div(totalTime);
            }
        }
    }
    return new BN(0);
};
// https://github.com/near/core-contracts/blob/master/lockup/src/getters.rs#L64
/**
 * For reference @link https://github.com/near/core-contracts/blob/master/lockup/src/getters.rs#L64
 * @param lockupState {@link LockupState}
 * @returns BN
 */
export const getLockedTokenAmount = async (lockupState) => {
    const phase2Time = new BN("1602614338293769340");
    const now = new BN((new Date().getTime() * 1000000).toString());
    if (now.lte(phase2Time)) {
        return saturatingSub(lockupState.lockupAmount, lockupState.terminationWithdrawnTokens);
    }
    const lockupTimestamp = BN.max(phase2Time.add(lockupState.lockupDuration), lockupState.lockupTimestamp);
    const blockTimestamp = now;
    if (blockTimestamp.lt(lockupTimestamp)) {
        return saturatingSub(lockupState.lockupAmount, lockupState.terminationWithdrawnTokens);
    }
    const unreleasedAmount = getUnreleasedAmount(lockupState.releaseDuration, lockupState.lockupTimestamp, lockupState.hasBrokenTimestamp, blockTimestamp, lockupState.lockupAmount);
    const unvestedAmount = getUnvestedAmount(lockupState?.vestingInformation, blockTimestamp, lockupState.lockupAmount);
    return BN.max(saturatingSub(unreleasedAmount, lockupState.terminationWithdrawnTokens), unvestedAmount);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFsYW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvYmFsYW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFJdkIsT0FBTyxFQUFFLHVCQUF1QixFQUFFLGFBQWEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUVqRTs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxtQkFBbUIsR0FBRyxDQUMxQixlQUFtQixFQUNuQixlQUFtQixFQUNuQixlQUF3QixFQUN4QixjQUFrQixFQUNsQixZQUFnQixFQUNaLEVBQUU7SUFDTixJQUFJLGVBQWUsRUFBRTtRQUNuQixNQUFNLGNBQWMsR0FBRyx1QkFBdUIsQ0FDNUMsZUFBZSxFQUNmLGVBQWUsRUFDZixlQUFlLENBQ2hCLENBQUM7UUFDRixNQUFNLFlBQVksR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRXpELElBQUksWUFBWSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUNuQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO2FBQU07WUFDTCxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2xELE9BQU8sWUFBWTtpQkFDaEIsR0FBRyxDQUFDLFFBQVEsQ0FBQztpQkFDYixHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDekI7S0FDRjtTQUFNO1FBQ0wsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQjtBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0saUJBQWlCLEdBQUcsQ0FDeEIsa0JBQXNDLEVBQ3RDLGNBQWtCLEVBQ2xCLFlBQWdCLEVBQ2QsRUFBRTtJQUNKLElBQUksa0JBQWtCLEVBQUU7UUFDdEIsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLEVBQUU7WUFDckMsaUJBQWlCO1lBQ2pCLE9B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