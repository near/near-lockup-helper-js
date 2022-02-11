"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewLockupAccount = exports.lookupLockup = exports.viewLockupState = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const nearAPI = __importStar(require("near-api-js"));
const serialize_1 = require("near-api-js/lib/utils/serialize");
const balance_1 = require("./balance");
const near_1 = require("./near");
const utils_1 = require("./utils");
exports.viewLockupState = async (contractId) => {
    const near = await near_1.nearApi();
    const lockupAccountCodeHash = (await (await near.account(contractId)).state()).code_hash;
    const result = await near.connection.provider.query({
        request_type: "view_state",
        finality: "final",
        account_id: contractId,
        prefix_base64: Buffer.from("STATE", "utf-8").toString("base64"),
    });
    const value = Buffer.from(result.values[0].value, "base64");
    const reader = new serialize_1.BinaryReader(value);
    const owner = reader.readString();
    const lockupAmount = reader.readU128().toString();
    const terminationWithdrawnTokens = reader.readU128().toString();
    const lockupDuration = reader.readU64().toString();
    const releaseDuration = utils_1.readOption(reader);
    const lockupTimestamp = utils_1.readOption(reader);
    // More details: https://github.com/near/core-contracts/pull/136
    const hasBrokenTimestamp = [
        '3kVY9qcVRoW3B5498SMX6R3rtSLiCdmBzKs7zcnzDJ7Q',
        'DiC9bKCqUHqoYqUXovAnqugiuntHWnM3cAc7KrgaHTu'
    ].includes(lockupAccountCodeHash);
    const transferInformation = utils_1.getTransferInformation(reader);
    const vestingInformation = utils_1.getVestingInformation(reader);
    return {
        owner,
        lockupAmount: new bn_js_1.default(lockupAmount),
        terminationWithdrawnTokens: new bn_js_1.default(terminationWithdrawnTokens),
        lockupDuration: new bn_js_1.default(lockupDuration),
        releaseDuration: new bn_js_1.default(releaseDuration),
        lockupTimestamp: new bn_js_1.default(lockupTimestamp),
        transferInformation,
        vestingInformation,
        hasBrokenTimestamp
    };
};
/**
 *
 * @param accountId near lockup accountId used to interact with the network.
 */
exports.lookupLockup = async (accountId) => {
    try {
        const lockupAccount = await (await near_1.nearApi()).account(accountId);
        const [lockupAccountBalance, lockupState] = await Promise.all([
            lockupAccount.viewFunction(accountId, 'get_balance', {}),
            exports.viewLockupState(accountId)
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
async function viewLockupAccount(lockupAccountId) {
    const near = await near_1.nearApi();
    try {
        const account = await near.account(lockupAccountId);
        const ownerAccountBalance = (await account.state()).amount;
        const { lockupAccountBalance, lockupState } = await exports.lookupLockup(lockupAccountId);
        if (lockupState) {
            const { releaseDuration, vestingInformation } = lockupState, restLockupState = __rest(lockupState, ["releaseDuration", "vestingInformation"]);
            const lockupReleaseStartTimestamp = utils_1.getStartLockupTimestamp(lockupState.lockupDuration, lockupState.lockupTimestamp, lockupState.hasBrokenTimestamp);
            const lockedAmount = await balance_1.getLockedTokenAmount(lockupState);
            return {
                lockupAccountId,
                ownerAccountBalance: nearAPI.utils.format.formatNearAmount(ownerAccountBalance, 2),
                lockedAmount: nearAPI.utils.format.formatNearAmount(lockedAmount.toString(), 2),
                liquidAmount: nearAPI.utils.format.formatNearAmount(new bn_js_1.default(lockupAccountBalance).sub(new bn_js_1.default(lockedAmount)).toString(), 2),
                totalAmount: nearAPI.utils.format.formatNearAmount(new bn_js_1.default(ownerAccountBalance).add(new bn_js_1.default(lockupAccountBalance)).toString(), 2),
                lockupReleaseStartDate: new Date(lockupReleaseStartTimestamp.divn(1000000).toNumber()),
                lockupState: Object.assign(Object.assign({}, restLockupState), { releaseDuration: utils_1.formatReleseDuration(releaseDuration), vestedInfo: utils_1.formatVestingInfo(vestingInformation) }),
            };
        }
    }
    catch (error) {
        console.error(error);
    }
    return undefined;
}
exports.viewLockupAccount = viewLockupAccount;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ja3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9sb2NrdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQXVCO0FBQ3ZCLHFEQUF1QztBQUV2QywrREFBK0Q7QUFJL0QsdUNBQWlEO0FBQ2pELGlDQUFpQztBQUNqQyxtQ0FPaUI7QUFFSixRQUFBLGVBQWUsR0FBRyxLQUFLLEVBQUUsVUFBa0IsRUFBd0IsRUFBRTtJQUNoRixNQUFNLElBQUksR0FBRyxNQUFNLGNBQU8sRUFBRSxDQUFDO0lBQzdCLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFFekYsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQWtCO1FBQ25FLFlBQVksRUFBRSxZQUFZO1FBQzFCLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFVBQVUsRUFBRSxVQUFVO1FBQ3RCLGFBQWEsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0tBQ2hFLENBQUMsQ0FBQztJQUNILE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUQsTUFBTSxNQUFNLEdBQUcsSUFBSSx3QkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNsQyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsUUFB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