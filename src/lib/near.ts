import * as near from "near-api-js";
import { ConnectConfig } from "near-api-js/lib/connect";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";

import { ConnectOptions } from "../types/types";

const connectOptions: ConnectConfig = {
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
export const nearApi = async (config?: ConnectOptions) => {
  const options = {
    ...connectOptions,
    ...config
  };

  return await near.connect(options)
};
