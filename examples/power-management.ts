/**
 * Example: ATX Power Management
 * 
 * This example demonstrates:
 * - Checking power status
 * - Power on/off operations
 * - System reset
 */

import { PiKVMClient } from '../src/index';

async function main() {
  const client = new PiKVMClient({
    host: process.env.PIKVM_HOST || 'pikvm.local',
    username: process.env.PIKVM_USERNAME || 'admin',
    password: process.env.PIKVM_PASSWORD || 'admin',
    secure: true,
    rejectUnauthorized: false,
  });

  try {
    console.log('=== ATX Power Management Example ===\n');

    // Check current power status
    console.log('Checking power status...');
    const status = await client.getATXInfo();
    console.log('Power LED is:', status.leds?.power ? 'ON' : 'OFF');
    console.log();

    // Example: Power cycle (uncomment to execute)
    /*
    if (status.leds?.power) {
      console.log('System is ON. Initiating shutdown...');
      await client.powerOff();
      console.log('Power button pressed. Waiting for shutdown...');
      
      // Wait 30 seconds for graceful shutdown
      await new Promise(resolve => setTimeout(resolve, 30000));
      
      console.log('Powering back on...');
      await client.powerOn();
      console.log('Power button pressed.');
    } else {
      console.log('System is OFF. Powering on...');
      await client.powerOn();
      console.log('Power button pressed.');
    }
    */

    console.log('\nNote: Power cycle code is commented out for safety.');
    console.log('Uncomment the code block to test power management.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
