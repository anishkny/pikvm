# pikvm

Node.js library for interacting with PiKVM using the HTTP API.

## Installation

```bash
npm install pikvm
```

## Usage

```javascript
const { PiKVMClient } = require('pikvm');

const client = new PiKVMClient({
  host: '192.168.1.100',
  username: 'admin',
  password: 'admin',
  secure: true,
  rejectUnauthorized: false
});

// Get system information
client.getInfo().then(info => {
  console.log('System info:', info);
});

// ATX power management
client.powerOn().then(() => console.log('Power on'));
client.powerOff().then(() => console.log('Power off'));
client.reset().then(() => console.log('Reset'));

// MSD operations
client.getMSDInfo().then(info => console.log('MSD info:', info));
client.setMSDImage('debian.iso', true).then(() => console.log('ISO mounted'));
client.connectMSD().then(() => console.log('MSD connected'));
client.disconnectMSD().then(() => console.log('MSD disconnected'));

// HID control
client.sendKeys(['a', 'b', 'c']);
client.sendMouseMove(10, 20);
client.sendMouseButton('left', true);

// GPIO
client.getGPIO().then(gpio => console.log('GPIO:', gpio));
client.setGPIO('channel1', true);
```

## API

### Constructor

```javascript
new PiKVMClient(config)
```

Config options:
- `host` (required): PiKVM hostname or IP
- `username` (required): Username
- `password` (required): Password
- `port` (optional): Port number (default: 443 for HTTPS, 80 for HTTP)
- `secure` (optional): Use HTTPS (default: true)
- `rejectUnauthorized` (optional): Reject unauthorized certificates (default: false)

### Methods

**System**
- `getInfo()` - Get system information

**ATX Power**
- `getATXInfo()` - Get ATX status
- `powerOn()` - Power on
- `powerOff()` - Power off (short press)
- `forcePowerOff()` - Force power off (long press)
- `reset()` - Reset system

**MSD**
- `getMSDInfo()` - Get MSD information
- `setMSDImage(image, cdrom)` - Set image (cdrom: true for CD-ROM mode)
- `connectMSD()` - Connect drive
- `disconnectMSD()` - Disconnect drive
- `removeMSDImage(image)` - Remove image

**HID**
- `sendKeys(keys)` - Send keyboard keys
- `sendMouseMove(x, y)` - Move mouse
- `sendMouseButton(button, state)` - Mouse button event
- `sendMouseWheel(delta)` - Mouse wheel

**GPIO**
- `getGPIO()` - Get GPIO state
- `setGPIO(channel, state)` - Set GPIO channel
- `pulseGPIO(channel, delay)` - Pulse GPIO channel

## Testing

```bash
npm test
```

## License

MIT