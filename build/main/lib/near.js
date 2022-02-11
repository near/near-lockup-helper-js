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
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearApi = void 0;
const near = __importStar(require("near-api-js"));
const key_stores_1 = require("near-api-js/lib/key_stores");
const options = {
    nodeUrl: "https://rpc.mainnet.near.org",
    networkId: "mainnet",
    keyStore: new key_stores_1.InMemoryKeyStore(),
    headers: {}
};
/**
 *
 * @returns connection to Near network
 */
exports.nearApi = async () => await near.connect(options);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbmVhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQW9DO0FBQ3BDLDJEQUE4RDtBQUU5RCxNQUFNLE9BQU8sR0FBRztJQUNkLE9BQU8sRUFBRSw4QkFBOEI7SUFDdkMsU0FBUyxFQUFFLFNBQVM7SUFDcEIsUUFBUSxFQUFFLElBQUksNkJBQWdCLEVBQUU7SUFDaEMsT0FBTyxFQUFFLEVBQUU7Q0FDWixDQUFBO0FBRUQ7OztHQUdHO0FBQ1UsUUFBQSxPQUFPLEdBQUcsS0FBSyxJQUFJLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMifQ==