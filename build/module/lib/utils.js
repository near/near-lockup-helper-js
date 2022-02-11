import BN from "bn.js";
export const saturatingSub = (a, b) => {
    const res = a.sub(b);
    return res.gte(new BN(0)) ? res : new BN(0);
};
export const readOption = (reader) => {
    const x = reader.readU8();
    return x === 1 ? reader.readU64().toString() : "0";
};
/**
 *
 * @param info {@link VestingInformation}.
 * @returns string | undefined.
 */
export const formatVestingInfo = (info) => {
    if (!info?.start)
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
export const formatReleseDuration = (releaseDuration) => (releaseDuration.div(new BN("1000000000"))
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
export const getStartLockupTimestamp = (lockupDuration, lockupTimestamp, hasBrokenTimestamp) => {
    const phase2Time = new BN("1602614338293769340");
    const timestamp = BN.max(phase2Time.add(lockupDuration), lockupTimestamp);
    return hasBrokenTimestamp ? phase2Time : timestamp;
};
/**
 *
 * @param reader {@link BinaryReader}.
 * @returns one of {@link VestingInformation} or undefined.
 */
export const getVestingInformation = (reader) => {
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
export const getTransferInformation = (reader) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUt2QixNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFLLEVBQUUsQ0FBSyxFQUFFLEVBQUU7SUFDNUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFvQixFQUFVLEVBQUU7SUFDekQsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzFCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDckQsQ0FBQyxDQUFDO0FBRUY7Ozs7R0FJRztBQUNGLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLENBQUMsSUFBd0IsRUFBc0IsRUFBRTtJQUNqRixJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUs7UUFBRSxPQUFPLFNBQVMsQ0FBQyxDQUFDLE9BQU87SUFDM0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUM1RCxNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElB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