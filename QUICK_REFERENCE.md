# PiKVM Node.js Library - Quick Reference

## Installation
```bash
npm install pikvm
```

## Initialization
```typescript
import { PiKVMClient } from 'pikvm';

const client = new PiKVMClient({
  host: 'pikvm.local',    // Required
  username: 'admin',       // Required
  password: 'admin',       // Required
  secure: true,            // Optional (default: true)
  port: 443,               // Optional (default: 443 for HTTPS, 80 for HTTP)
  rejectUnauthorized: false // Optional (default: false)
});
```

## System Information
```typescript
await client.getInfo()        // Get system information
```

## Power Management
```typescript
await client.getATXInfo()     // Get ATX status
await client.powerOn()        // Power on
await client.powerOff()       // Power off (short press)
await client.forcePowerOff()  // Force power off (long press)
await client.reset()          // Reset system
```

## Mass Storage Device
```typescript
await client.getMSDInfo()                      // Get MSD info
await client.setMSDImage('debian.iso', true)   // Set image as CD-ROM
await client.setMSDImage('ubuntu.iso', false)  // Set image as USB
await client.connectMSD()                      // Connect drive
await client.disconnectMSD()                   // Disconnect drive
await client.removeMSDImage('debian.iso')      // Remove image
```

## HID Control
```typescript
await client.sendKeys(['a', 'b', 'c'])         // Send keyboard keys
await client.sendMouseMove(10, 20)             // Move mouse
await client.sendMouseButton('left', true)     // Press button
await client.sendMouseButton('left', false)    // Release button
await client.sendMouseWheel(-1)                // Scroll wheel
```

## GPIO
```typescript
await client.getGPIO()                         // Get GPIO state
await client.setGPIO('channel1', true)         // Set GPIO channel
await client.pulseGPIO('channel1', 0.5)        // Pulse channel (0.5s)
```

## Error Handling
```typescript
try {
  await client.powerOn();
} catch (error) {
  console.error('Failed:', error.message);
}
```

## TypeScript Types

All methods are fully typed. Available types:
- `PiKVMConfig` - Client configuration
- `SystemInfo` - System information
- `ATXInfo` - ATX power state
- `ATXButton` - Power button types
- `ATXPowerState` - Power states
- `MSDInfo` - MSD information
- `MSDImage` - Image details
- `GPIOInfo` - GPIO state
- `GPIOChannel` - GPIO channel info

## Examples

See the `examples/` directory for complete working examples:
- `basic.ts` - Basic usage
- `power-management.ts` - Power operations
- `msd-operations.ts` - Storage operations
- `workflow.ts` - Complete workflow

## Links

- [Full Documentation](README.md)
- [GitHub Repository](https://github.com/anishkny/pikvm)
- [PiKVM Website](https://pikvm.org/)
- [PiKVM API Docs](https://pikvm.github.io/pikvm/api/)
