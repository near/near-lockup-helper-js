import * as near from "near-api-js";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";
const options = {
    nodeUrl: "https://rpc.mainnet.near.org",
    networkId: "mainnet",
    keyStore: new InMemoryKeyStore(),
    headers: {}
};
/**
 *
 * @returns connection to Near network
 */
export const nearApi = async () => await near.connect(options);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbmVhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssSUFBSSxNQUFNLGFBQWEsQ0FBQztBQUNwQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUU5RCxNQUFNLE9BQU8sR0FBRztJQUNkLE9BQU8sRUFBRSw4QkFBOEI7SUFDdkMsU0FBUyxFQUFFLFNBQVM7SUFDcEIsUUFBUSxFQUFFLElBQUksZ0JBQWdCLEVBQUU7SUFDaEMsT0FBTyxFQUFFLEVBQUU7Q0FDWixDQUFBO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEtBQUssSUFBSSxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDIn0=