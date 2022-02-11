"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLockedTokenAmount = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const utils_1 = require("./utils");
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
        const startTimestamp = utils_1.getStartLockupTimestamp(releaseDuration, lockupTimestamp, brokenTimestamp);
        const endTimestamp = startTimestamp.add(releaseDuration);
        if (endTimestamp.lt(blockTimestamp)) {
            return new bn_js_1.default(0);
        }
        else {
            const timeLeft = endTimestamp.sub(blockTimestamp);
            return lockupAmount
                .mul(timeLeft)
                .div(releaseDuration);
        }
    }
    else {
        return new bn_js_1.default(0);
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
                return new bn_js_1.default(0);
            }
            else {
                const timeLeft = vestingInformation.end.sub(blockTimestamp);
                const totalTime = vestingInformation.end.sub(vestingInformation.start);
                return lockupAmount.mul(timeLeft).div(totalTime);
            }
        }
    }
    return new bn_js_1.default(0);
};
// https://github.com/near/core-contracts/blob/master/lockup/src/getters.rs#L64
/**
 * For reference @link https://github.com/near/core-contracts/blob/master/lockup/src/getters.rs#L64
 * @param lockupState {@link LockupState}
 * @returns BN
 */
exports.getLockedTokenAmount = async (lockupState) => {
    const phase2Time = new bn_js_1.default("1602614338293769340");
    const now = new bn_js_1.default((new Date().getTime() * 1000000).toString());
    if (now.lte(phase2Time)) {
        return utils_1.saturatingSub(lockupState.lockupAmount, lockupState.terminationWithdrawnTokens);
    }
    const lockupTimestamp = bn_js_1.default.max(phase2Time.add(lockupState.lockupDuration), lockupState.lockupTimestamp);
    const blockTimestamp = now;
    if (blockTimestamp.lt(lockupTimestamp)) {
        return utils_1.saturatingSub(lockupState.lockupAmount, lockupState.terminationWithdrawnTokens);
    }
    const unreleasedAmount = getUnreleasedAmount(lockupState.releaseDuration, lockupState.lockupTimestamp, lockupState.hasBrokenTimestamp, blockTimestamp, lockupState.lockupAmount);
    const unvestedAmount = getUnvestedAmount(lockupState === null || lockupState === void 0 ? void 0 : lockupState.vestingInformation, blockTimestamp, lockupState.lockupAmount);
    return bn_js_1.default.max(utils_1.saturatingSub(unreleasedAmount, lockupState.terminationWithdrawnTokens), unvestedAmount);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFsYW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvYmFsYW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBdUI7QUFJdkIsbUNBQWlFO0FBRWpFOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLG1CQUFtQixHQUFHLENBQzFCLGVBQW1CLEVBQ25CLGVBQW1CLEVBQ25CLGVBQXdCLEVBQ3hCLGNBQWtCLEVBQ2xCLFlBQWdCLEVBQ1osRUFBRTtJQUNOLElBQUksZUFBZSxFQUFFO1FBQ25CLE1BQU0sY0FBYyxHQUFHLCtCQUF1QixDQUM1QyxlQUFlLEVBQ2YsZUFBZSxFQUNmLGVBQWUsQ0FDaEIsQ0FBQztRQUNGLE1BQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFekQsSUFBSSxZQUFZLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQ25DLE9BQU8sSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEI7YUFBTTtZQUNMLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDbEQsT0FBTyxZQUFZO2lCQUNoQixHQUFHLENBQUMsUUFBUSxDQUFDO2lCQUNiLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUN6QjtLQUNGO1NBQU07UUFDTCxPQUFPLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xCO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxpQkFBaUIsR0FBRyxDQUN4QixrQkFBc0MsRUFDdEMsY0FBa0IsRUFDbEIsWUFBZ0IsRUFDZCxFQUFFO0lBQ0osSUFBSSxrQkFBa0IsRUFBRTtRQUN0QixJQUFJLGtCQUFrQixDQUFDLGNBQWMsRUFBRTtZQUNyQyxpQkFBaUI7WUFDakIsT0FBTyxrQkFBa0IsQ0FBQyxjQUFjLENBQUM7U0FDMUM7YUFBTSxJQUFJLGtCQUFrQixDQUFD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