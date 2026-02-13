# Examples

This directory contains example scripts demonstrating how to use the PiKVM Node.js library.

## Prerequisites

Before running these examples, you need to:

1. Have a PiKVM device accessible on your network
2. Know your PiKVM's IP address or hostname
3. Have valid credentials (username and password)

## Setting up environment variables

For security, it's recommended to use environment variables for your credentials:

```bash
export PIKVM_HOST="192.168.1.100"
export PIKVM_USERNAME="admin"
export PIKVM_PASSWORD="your_password"
```

## Running examples

Since these are TypeScript files, you have two options:

### Option 1: Compile and run

```bash
# Build the library
npm run build

# Compile the example
npx tsc examples/basic.ts --outDir /tmp

# Run the compiled example
node /tmp/examples/basic.js
```

### Option 2: Use ts-node

```bash
# Install ts-node (if not already installed)
npm install -g ts-node

# Run the example directly
ts-node examples/basic.ts
```

## Available Examples

### basic.ts
Demonstrates basic usage including:
- Creating a client instance
- Getting system information
- Getting ATX status
- Getting MSD information

```bash
ts-node examples/basic.ts
```

### power-management.ts
Shows how to manage system power:
- Check power status
- Power on/off
- Force power off
- System reset

**Note:** Power operations are commented out for safety. Uncomment them only if you're sure.

```bash
ts-node examples/power-management.ts
```

### msd-operations.ts
Demonstrates Mass Storage Device operations:
- List available images
- Mount ISO images
- Connect/disconnect virtual drive
- Check storage information

**Note:** Mount operations are commented out for safety. Uncomment them only if you're sure.

```bash
ts-node examples/msd-operations.ts
```

## Safety Notes

⚠️ **Important:** Some operations in these examples are commented out because they can:
- Restart or shut down the connected system
- Modify mass storage device configurations
- Affect running systems

Only uncomment and use these operations if you understand their impact and have permission to perform them on the target system.
