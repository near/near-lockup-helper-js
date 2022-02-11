import * as near from "near-api-js";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";

const options = {
  nodeUrl: "https://rpc.mainnet.near.org",
  networkId: "mainnet",
  keyStore: new InMemoryKeyStore(),
  headers: {}
}

/**
 *
 * @returns connection to Near network
 */
export const nearApi = async () => await near.connect(options);
