/**
 * Example: Mass Storage Device Operations
 * 
 * This example demonstrates:
 * - Listing available images
 * - Mounting an ISO image
 * - Connecting/disconnecting MSD
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
    console.log('=== MSD Operations Example ===\n');

    // Get MSD information
    console.log('Getting MSD information...');
    const msdInfo = await client.getMSDInfo();
    
    console.log('MSD Status:');
    console.log('  Enabled:', msdInfo.enabled);
    console.log('  Online:', msdInfo.online);
    console.log('  Busy:', msdInfo.busy);
    console.log();

    if (msdInfo.storage) {
      console.log('Storage Information:');
      console.log('  Total size:', (msdInfo.storage.size / 1024 / 1024 / 1024).toFixed(2), 'GB');
      console.log('  Free space:', (msdInfo.storage.free / 1024 / 1024 / 1024).toFixed(2), 'GB');
      console.log();

      console.log('Available Images:');
      const images = msdInfo.storage.images;
      if (Object.keys(images).length === 0) {
        console.log('  No images available');
      } else {
        for (const [name, info] of Object.entries(images)) {
          console.log(`  - ${name}`);
          console.log(`    Size: ${(info.size / 1024 / 1024).toFixed(2)} MB`);
          console.log(`    Complete: ${info.complete}`);
        }
      }
      console.log();
    }

    if (msdInfo.drive) {
      console.log('Current Drive Status:');
      console.log('  Connected:', msdInfo.drive.connected);
      console.log('  Current image:', msdInfo.drive.image || 'None');
      console.log('  CD-ROM mode:', msdInfo.drive.cdrom);
      console.log();
    }

    // Example: Mount an image (uncomment to execute)
    /*
    const imageName = 'debian.iso';
    console.log(`Mounting ${imageName} as CD-ROM...`);
    await client.setMSDImage(imageName, true);
    console.log('Connecting MSD...');
    await client.connectMSD();
    console.log('MSD connected successfully!');
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Disconnecting MSD...');
    await client.disconnectMSD();
    console.log('MSD disconnected.');
    */

    console.log('\nNote: Image mounting code is commented out for safety.');
    console.log('Uncomment the code block to test MSD operations.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
