// config/alephConfig.js
// 
// Description: Aleph Network configuration for the distributed VM system
// 
// This file contains all Aleph network related configuration including
// account setup, channel settings, and node URLs. It's designed to be
// shared across all components of the distributed VM system.
// 
// Configuration:
//   - Aleph account authentication
//   - Network channel settings
//   - Node URLs and endpoints
//   - Environment variable validation
// 
// Inputs: Environment variables (ALEPH_ACCOUNT_PRIVATE_KEY, etc.)
// Outputs: Configured Aleph account and network settings
// 
// Dependencies: 
//   - @aleph-sdk/ethereum (account management)
//   - Environment variables for configuration

import { importAccountFromPrivateKey } from "@aleph-sdk/ethereum";

// Validate that the private key is set in the environment variables
if (!process.env.ALEPH_ACCOUNT_PRIVATE_KEY) {
    console.warn("ALEPH_ACCOUNT_PRIVATE_KEY is not set in the .env file - using unauthenticated mode");
}

// Import the Aleph account using only the private key
let alephAccount = null;
try {
    if (process.env.ALEPH_ACCOUNT_PRIVATE_KEY) {
        alephAccount = importAccountFromPrivateKey(process.env.ALEPH_ACCOUNT_PRIVATE_KEY);
        console.log('Aleph account loaded successfully');
    }
} catch (error) {
    console.error('Failed to load Aleph account:', error.message);
}

export const alephConfig = {
    alephAccount,
    alephChannel: process.env.ALEPH_CHANNEL || "ALEPH-CLOUDSOLUTIONS",
    alephNodeUrl: process.env.ALEPH_NODE_URL || "https://46.255.204.193",
    alephImage: process.env.ALEPH_IMAGE || "4a0f62da42f4478544616519e6f5d58adb1096e069b392b151d47c3609492d0c",
    schedulerUrl: process.env.SCHEDULER_URL || "https://scheduler.api.aleph.cloud",
    sshKeyDirectory: process.env.SSH_KEY_DIRECTORY || "keys"
};

export default alephConfig; 