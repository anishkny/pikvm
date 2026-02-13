# PiKVM Node.js Library

A Node.js/TypeScript library for interacting with [PiKVM](https://pikvm.org/) devices using the HTTP API.

## Features

- 🔌 Full TypeScript support with type definitions
- 🔐 Authentication support (Basic Auth)
- ⚡ ATX power management (power on/off, reset)
- 💾 Mass Storage Device (MSD) operations
- ⌨️ HID (keyboard and mouse) control
- 🔧 GPIO operations
- 📊 System information and status

## Installation

```bash
npm install pikvm
```

## Usage

### Basic Setup

```typescript
import { PiKVMClient } from 'pikvm';

const client = new PiKVMClient({
  host: '192.168.1.100',  // Your PiKVM IP or hostname
  username: 'admin',       // Your PiKVM username
  password: 'admin',       // Your PiKVM password
  secure: true,            // Use HTTPS (default: true)
  rejectUnauthorized: false, // Accept self-signed certificates
});
```

### ATX Power Management

```typescript
// Get current ATX state
const atxInfo = await client.getATXInfo();
console.log('Power LED:', atxInfo.leds?.power);

// Power on the system
await client.powerOn();

// Power off the system (short press)
await client.powerOff();

// Force power off (long press)
await client.forcePowerOff();

// Reset the system
await client.reset();
```

### System Information

```typescript
// Get system information
const info = await client.getInfo();
console.log('System info:', info);
```

### Mass Storage Device (MSD)

```typescript
// Get MSD information
const msdInfo = await client.getMSDInfo();
console.log('MSD online:', msdInfo.online);
console.log('Available images:', msdInfo.storage?.images);

// Set and connect an image
await client.setMSDImage('debian.iso', true); // Mount as CD-ROM
await client.connectMSD();

// Disconnect MSD
await client.disconnectMSD();

// Remove an image
await client.removeMSDImage('debian.iso');
```

### HID (Keyboard and Mouse) Control

```typescript
// Send keyboard keys
await client.sendKeys(['a', 'b', 'c']);

// Send mouse movement
await client.sendMouseMove(10, 20); // Move 10px right, 20px down

// Click mouse button
await client.sendMouseButton('left', true);  // Press left button
await client.sendMouseButton('left', false); // Release left button

// Scroll mouse wheel
await client.sendMouseWheel(-1); // Scroll up
```

### GPIO Operations

```typescript
// Get GPIO state
const gpio = await client.getGPIO();
console.log('GPIO state:', gpio);

// Set GPIO channel
await client.setGPIO('channel1', true);

// Pulse GPIO channel
await client.pulseGPIO('channel1', 0.5); // 0.5 second pulse
```

## API Reference

### Constructor

```typescript
new PiKVMClient(config: PiKVMConfig)
```

Configuration options:
- `host` (string, required): PiKVM hostname or IP address
- `username` (string, required): Username for authentication
- `password` (string, required): Password for authentication
- `port` (number, optional): Port number (default: 443 for HTTPS, 80 for HTTP)
- `secure` (boolean, optional): Use HTTPS (default: true)
- `rejectUnauthorized` (boolean, optional): Reject unauthorized SSL certificates (default: false)

### Methods

#### System Information
- `getInfo(): Promise<SystemInfo>` - Get system information

#### ATX Power Management
- `getATXInfo(): Promise<ATXInfo>` - Get ATX power state information
- `clickATXButton(button: ATXButton, wait?: boolean): Promise<void>` - Click ATX button
- `powerOn(): Promise<void>` - Power on the system
- `powerOff(): Promise<void>` - Power off the system
- `forcePowerOff(): Promise<void>` - Force power off (long press)
- `reset(): Promise<void>` - Reset the system

#### Mass Storage Device
- `getMSDInfo(): Promise<MSDInfo>` - Get MSD information
- `setMSDImage(image: string | null, cdrom?: boolean): Promise<void>` - Set MSD image
- `connectMSD(): Promise<void>` - Connect MSD
- `disconnectMSD(): Promise<void>` - Disconnect MSD
- `removeMSDImage(image: string): Promise<void>` - Remove MSD image

#### HID Control
- `sendKeys(keys: string[]): Promise<void>` - Send keyboard keys
- `sendMouseMove(x: number, y: number): Promise<void>` - Send mouse movement
- `sendMouseButton(button: string, state: boolean): Promise<void>` - Send mouse button event
- `sendMouseWheel(delta: number): Promise<void>` - Send mouse wheel event

#### GPIO
- `getGPIO(): Promise<any>` - Get GPIO state
- `setGPIO(channel: string, state: boolean): Promise<void>` - Set GPIO channel state
- `pulseGPIO(channel: string, delay?: number): Promise<void>` - Pulse GPIO channel

## Examples

### Complete Power Cycle Example

```typescript
import { PiKVMClient } from 'pikvm';

async function powerCycle() {
  const client = new PiKVMClient({
    host: 'pikvm.local',
    username: 'admin',
    password: 'admin',
  });

  console.log('Getting ATX status...');
  const status = await client.getATXInfo();
  console.log('Power LED:', status.leds?.power);

  if (status.leds?.power) {
    console.log('Powering off...');
    await client.powerOff();
    
    // Wait for shutdown
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  console.log('Powering on...');
  await client.powerOn();
}

powerCycle().catch(console.error);
```

### Boot from ISO Example

```typescript
import { PiKVMClient } from 'pikvm';

async function bootFromISO(isoName: string) {
  const client = new PiKVMClient({
    host: 'pikvm.local',
    username: 'admin',
    password: 'admin',
  });

  // Set the ISO image as CD-ROM
  console.log(`Setting image: ${isoName}`);
  await client.setMSDImage(isoName, true);

  // Connect the MSD
  console.log('Connecting MSD...');
  await client.connectMSD();

  // Reset the system to boot from ISO
  console.log('Resetting system...');
  await client.reset();

  console.log('System is booting from ISO');
}

bootFromISO('debian-12.iso').catch(console.error);
```

## Requirements

- Node.js 12 or higher
- PiKVM device with HTTP API enabled

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- [PiKVM Official Website](https://pikvm.org/)
- [PiKVM API Documentation](https://pikvm.github.io/pikvm/api/)
- [GitHub Repository](https://github.com/anishkny/pikvm)