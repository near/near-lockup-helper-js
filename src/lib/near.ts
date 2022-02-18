import * as near from "near-api-js";
import { ConnectConfig } from "near-api-js/lib/connect";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";

const options: ConnectConfig = {
  nodeUrl: "https://rpc.mainnet.near.org",
  networkId: "mainnet",
  keyStore: new InMemoryKeyStore(),
  headers: {},
};

/**
 * Connect to NEAR rpc.
 * @param config connection options {@link ConnectConfig}.
 * @returns connection to Near network.
 */
export const nearApi = async (config: ConnectConfig = options) => await near.connect(config);
