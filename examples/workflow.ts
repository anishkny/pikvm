/**
 * Example: Complete Workflow - Boot from ISO and Monitor
 * 
 * This example demonstrates a complete workflow:
 * - Check current system state
 * - Mount an ISO image
 * - Power cycle the system
 * - Monitor the boot process
 */

import { PiKVMClient } from '../src/index';

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bootFromISOWorkflow(isoName: string) {
  const client = new PiKVMClient({
    host: process.env.PIKVM_HOST || 'pikvm.local',
    username: process.env.PIKVM_USERNAME || 'admin',
    password: process.env.PIKVM_PASSWORD || 'admin',
    secure: true,
    rejectUnauthorized: false,
  });

  try {
    console.log('=== Boot from ISO Workflow ===\n');

    // Step 1: Check system information
    console.log('Step 1: Checking system information...');
    const sysInfo = await client.getInfo();
    console.log('Server:', sysInfo.meta?.server);
    console.log();

    // Step 2: Check MSD availability
    console.log('Step 2: Checking MSD availability...');
    const msdInfo = await client.getMSDInfo();
    
    if (!msdInfo.enabled) {
      throw new Error('MSD is not enabled on this PiKVM');
    }
    
    console.log('MSD is enabled and available');
    console.log('Available images:', Object.keys(msdInfo.storage?.images || {}));
    console.log();

    // Step 3: Verify the ISO exists
    console.log(`Step 3: Verifying ISO "${isoName}" exists...`);
    if (msdInfo.storage?.images && !(isoName in msdInfo.storage.images)) {
      throw new Error(`ISO "${isoName}" not found in available images`);
    }
    console.log(`✓ ISO "${isoName}" found`);
    console.log();

    // Step 4: Mount the ISO (COMMENTED OUT FOR SAFETY)
    console.log('Step 4: Would mount the ISO as CD-ROM...');
    console.log('  (Commented out for safety)');
    /*
    await client.setMSDImage(isoName, true);
    console.log('✓ ISO configured as CD-ROM');
    */
    console.log();

    // Step 5: Connect the MSD (COMMENTED OUT FOR SAFETY)
    console.log('Step 5: Would connect the MSD...');
    console.log('  (Commented out for safety)');
    /*
    await client.connectMSD();
    console.log('✓ MSD connected');
    */
    console.log();

    // Step 6: Check current power state
    console.log('Step 6: Checking power state...');
    const atxInfo = await client.getATXInfo();
    console.log('Power LED:', atxInfo.leds?.power ? 'ON' : 'OFF');
    console.log();

    // Step 7: Perform power cycle (COMMENTED OUT FOR SAFETY)
    console.log('Step 7: Would perform power cycle...');
    console.log('  (Commented out for safety)');
    /*
    if (atxInfo.leds?.power) {
      console.log('System is ON. Sending reset signal...');
      await client.reset();
    } else {
      console.log('System is OFF. Powering on...');
      await client.powerOn();
    }
    console.log('✓ Power cycle initiated');
    */
    console.log();

    // Step 8: Monitor boot (COMMENTED OUT FOR SAFETY)
    console.log('Step 8: Would monitor boot process...');
    console.log('  (Commented out for safety)');
    /*
    console.log('Monitoring boot process for 30 seconds...');
    for (let i = 0; i < 6; i++) {
      await sleep(5000);
      const status = await client.getATXInfo();
      console.log(`  [${i * 5}s] Power LED: ${status.leds?.power ? 'ON' : 'OFF'}`);
    }
    */
    console.log();

    console.log('=== Workflow Complete ===');
    console.log('\nNote: All actual operations are commented out for safety.');
    console.log('This is a demonstration of the workflow structure.');
    console.log('Uncomment the operations if you want to execute them.');
  } catch (error) {
    console.error('Workflow failed:', error);
    process.exit(1);
  }
}

// Example usage
const isoName = process.argv[2] || 'debian.iso';
console.log(`Using ISO: ${isoName}\n`);

bootFromISOWorkflow(isoName);
