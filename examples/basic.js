const { PiKVMClient } = require('../lib/index');

// Create a PiKVM client
const client = new PiKVMClient({
  host: process.env.PIKVM_HOST || 'pikvm.local',
  username: process.env.PIKVM_USERNAME || 'admin',
  password: process.env.PIKVM_PASSWORD || 'admin',
  secure: true,
  rejectUnauthorized: false
});

async function main() {
  try {
    console.log('=== PiKVM Client Example ===\n');

    // Get system information
    console.log('Getting system information...');
    const info = await client.getInfo();
    console.log('System info:', JSON.stringify(info, null, 2));
    console.log();

    // Get ATX status
    console.log('Getting ATX status...');
    const atxInfo = await client.getATXInfo();
    console.log('ATX enabled:', atxInfo.enabled);
    console.log('Power LED:', atxInfo.leds ? atxInfo.leds.power : 'N/A');
    console.log();

    // Get MSD information
    console.log('Getting MSD information...');
    const msdInfo = await client.getMSDInfo();
    console.log('MSD enabled:', msdInfo.enabled);
    console.log('MSD online:', msdInfo.online);
    console.log();

    console.log('Example completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
