"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransferInformation = exports.getVestingInformation = exports.getStartLockupTimestamp = exports.formatReleseDuration = exports.formatVestingInfo = exports.readOption = exports.saturatingSub = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
exports.saturatingSub = (a, b) => {
    const res = a.sub(b);
    return res.gte(new bn_js_1.default(0)) ? res : new bn_js_1.default(0);
};
exports.readOption = (reader) => {
    const x = reader.readU8();
    return x === 1 ? reader.readU64().toString() : "0";
};
/**
 *
 * @param info {@link VestingInformation}.
 * @returns string | undefined.
 */
exports.formatVestingInfo = (info) => {
    if (!(info === null || info === void 0 ? void 0 : info.start))
        return undefined; // TODO
    const start = new Date(info.start.divn(1000000).toNumber());
    const cliff = new Date(info.cliff.divn(1000000).toNumber());
    const end = new Date(info.end.divn(1000000).toNumber());
    return `from ${start} until ${end} with cliff at ${cliff}`;
};
/**
 *
 * @param releaseDuration BN.
 * @returns BN.
 */
exports.formatReleseDuration = (releaseDuration) => (releaseDuration.div(new bn_js_1.default("1000000000"))
    .divn(60)
    .divn(60)
    .divn(24));
/**
 *
 * @param lockupDuration
 * @param lockupTimestamp
 * @param hasBrokenTimestamp
 * @returns timestamp.
 */
exports.getStartLockupTimestamp = (lockupDuration, lockupTimestamp, hasBrokenTimestamp) => {
    const phase2Time = new bn_js_1.default("1602614338293769340");
    const timestamp = bn_js_1.default.max(phase2Time.add(lockupDuration), lockupTimestamp);
    return hasBrokenTimestamp ? phase2Time : timestamp;
};
/**
 *
 * @param reader {@link BinaryReader}.
 * @returns one of {@link VestingInformation} or undefined.
 */
exports.getVestingInformation = (reader) => {
    const vestingType = reader.readU8();
    switch (vestingType) {
        case 1:
            return {
                vestingHash: reader.readArray(() => reader.readU8())
            };
        case 2:
            return {
                start: reader.readU64(),
                cliff: reader.readU64(),
                end: reader.readU64()
            };
        case 3:
            return {
                unvestedAmount: reader.readU128(),
                terminationStatus: reader.readU8()
            };
        default:
            return undefined; // TODO
    }
};
/**
 *
 * @param reader {@link BinaryReader}.
 * @returns one of {@link TransferInformation}.
 */
exports.getTransferInformation = (reader) => {
    const tiType = reader.readU8();
    if (tiType === 0) {
        return {
            transfers_timestamp: reader.readU64()
        };
    }
    else {
        return {
            transfer_poll_account_id: reader.readString()
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLGtEQUF1QjtBQUtWLFFBQUEsYUFBYSxHQUFHLENBQUMsQ0FBSyxFQUFFLENBQUssRUFBRSxFQUFFO0lBQzVDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckIsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUMsQ0FBQyxDQUFDO0FBRVcsUUFBQSxVQUFVLEdBQUcsQ0FBQyxNQUFvQixFQUFVLEVBQUU7SUFDekQsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzFCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDckQsQ0FBQyxDQUFDO0FBRUY7Ozs7R0FJRztBQUNXLFFBQUEsaUJBQWlCLEdBQUcsQ0FBQyxJQUF3QixFQUFzQixFQUFFO0lBQ2pGLElBQUksRUFBQyxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsS0FBSyxDQUFBO1FBQUUsT0FBTyxTQUFTLENBQUMsQ0FBQyxPQUFPO0lBQzNDLE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDNUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFD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