/**
 * Example: Basic usage of PiKVM client
 * 
 * This example demonstrates:
 * - Creating a client instance
 * - Getting system information
 * - Getting ATX status
 * - Power management operations
 */

import { PiKVMClient } from '../src/index';

async function main() {
  // Create a PiKVM client instance
  const client = new PiKVMClient({
    host: process.env.PIKVM_HOST || 'pikvm.local',
    username: process.env.PIKVM_USERNAME || 'admin',
    password: process.env.PIKVM_PASSWORD || 'admin',
    secure: true,
    rejectUnauthorized: false, // Accept self-signed certificates
  });

  try {
    console.log('=== PiKVM Basic Example ===\n');

    // Get system information
    console.log('1. Getting system information...');
    const info = await client.getInfo();
    console.log('System info:', JSON.stringify(info, null, 2));
    console.log();

    // Get ATX status
    console.log('2. Getting ATX status...');
    const atxInfo = await client.getATXInfo();
    console.log('ATX enabled:', atxInfo.enabled);
    console.log('ATX busy:', atxInfo.busy);
    console.log('Power LED:', atxInfo.leds?.power);
    console.log('HDD LED:', atxInfo.leds?.hdd);
    console.log();

    // Get MSD information
    console.log('3. Getting MSD information...');
    const msdInfo = await client.getMSDInfo();
    console.log('MSD enabled:', msdInfo.enabled);
    console.log('MSD online:', msdInfo.online);
    console.log('Available images:', Object.keys(msdInfo.storage?.images || {}));
    console.log();

    console.log('Example completed successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the example
main();
