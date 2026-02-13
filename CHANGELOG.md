# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-02-13

### Added
- Initial release of PiKVM Node.js library
- Full TypeScript support with type definitions
- Authentication support (Basic Auth)
- ATX power management API:
  - Get ATX status and LED states
  - Power on/off operations
  - Force power off (long press)
  - System reset
- Mass Storage Device (MSD) operations:
  - Get MSD information and status
  - List available images
  - Set and mount ISO images
  - Connect/disconnect virtual drive
  - Remove images
- HID (Human Interface Device) control:
  - Send keyboard keys
  - Mouse movement
  - Mouse button clicks
  - Mouse wheel scrolling
- GPIO operations:
  - Get GPIO state
  - Set GPIO channel state
  - Pulse GPIO channels
- System information retrieval
- Comprehensive documentation and README
- Usage examples:
  - Basic usage example
  - ATX power management example
  - MSD operations example
  - Complete workflow example
- Contributing guidelines
- ISC License

### Security
- No known security vulnerabilities
- Secure HTTPS support with certificate validation options
- Basic authentication for API access
