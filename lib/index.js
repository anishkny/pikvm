const http = require('http');
const https = require('https');

/**
 * ATX button actions
 */
const ATXButton = {
  POWER: 'power',
  POWER_LONG: 'power_long',
  RESET: 'reset'
};

/**
 * ATX power states
 */
const ATXPowerState = {
  ON: 'on',
  OFF: 'off'
};

/**
 * PiKVM Client
 */
class PiKVMClient {
  /**
   * Create a new PiKVM client
   * @param {Object} config - Configuration options
   * @param {string} config.host - PiKVM hostname or IP address
   * @param {string} config.username - Username for authentication
   * @param {string} config.password - Password for authentication
   * @param {number} [config.port] - Port number (default: 443 for HTTPS, 80 for HTTP)
   * @param {boolean} [config.secure=true] - Use HTTPS
   * @param {boolean} [config.rejectUnauthorized=false] - Reject unauthorized SSL certificates
   */
  constructor(config) {
    if (!config.host || !config.username || !config.password) {
      throw new Error('host, username, and password are required');
    }

    this.config = {
      host: config.host,
      port: config.port || (config.secure !== false ? 443 : 80),
      secure: config.secure !== false,
      username: config.username,
      password: config.password,
      rejectUnauthorized: config.rejectUnauthorized || false
    };

    // Create base64 encoded auth header
    const auth = Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64');
    this.authHeader = `Basic ${auth}`;
  }

  /**
   * Make an HTTP request to PiKVM API
   * @private
   */
  request(method, path, body) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.config.host,
        port: this.config.port,
        path,
        method,
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json'
        },
        rejectUnauthorized: this.config.rejectUnauthorized
      };

      const client = this.config.secure ? https : http;
      
      const req = client.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = data ? JSON.parse(data) : {};
              resolve(parsed);
            } catch (e) {
              resolve(data);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  /**
   * Get system information
   * @returns {Promise<Object>}
   */
  getInfo() {
    return this.request('GET', '/api/info');
  }

  /**
   * Get ATX power state information
   * @returns {Promise<Object>}
   */
  getATXInfo() {
    return this.request('GET', '/api/atx');
  }

  /**
   * Click ATX button
   * @param {string} button - Button to click (power, power_long, reset)
   * @param {boolean} [wait=true] - Wait for completion
   * @returns {Promise<void>}
   */
  clickATXButton(button, wait = true) {
    return this.request('POST', `/api/atx/click?button=${button}&wait=${wait ? '1' : '0'}`, {});
  }

  /**
   * Power on the system
   * @returns {Promise<void>}
   */
  powerOn() {
    return this.clickATXButton(ATXButton.POWER);
  }

  /**
   * Power off the system (short press)
   * @returns {Promise<void>}
   */
  powerOff() {
    return this.clickATXButton(ATXButton.POWER);
  }

  /**
   * Force power off (long press)
   * @returns {Promise<void>}
   */
  forcePowerOff() {
    return this.clickATXButton(ATXButton.POWER_LONG);
  }

  /**
   * Reset the system
   * @returns {Promise<void>}
   */
  reset() {
    return this.clickATXButton(ATXButton.RESET);
  }

  /**
   * Get MSD (Mass Storage Device) information
   * @returns {Promise<Object>}
   */
  getMSDInfo() {
    return this.request('GET', '/api/msd');
  }

  /**
   * Set MSD image
   * @param {string|null} image - Image name or null to disconnect
   * @param {boolean} [cdrom=false] - Mount as CD-ROM
   * @returns {Promise<void>}
   */
  setMSDImage(image, cdrom = false) {
    return this.request('POST', '/api/msd/set_params', { image, cdrom });
  }

  /**
   * Connect MSD
   * @returns {Promise<void>}
   */
  connectMSD() {
    return this.request('POST', '/api/msd/set_connected', { connected: true });
  }

  /**
   * Disconnect MSD
   * @returns {Promise<void>}
   */
  disconnectMSD() {
    return this.request('POST', '/api/msd/set_connected', { connected: false });
  }

  /**
   * Remove MSD image
   * @param {string} image - Image name
   * @returns {Promise<void>}
   */
  removeMSDImage(image) {
    return this.request('POST', `/api/msd/remove?image=${encodeURIComponent(image)}`, {});
  }

  /**
   * Send keyboard keys
   * @param {Array<string>} keys - Array of key codes
   * @returns {Promise<void>}
   */
  sendKeys(keys) {
    return this.request('POST', '/api/hid/events/send_key', { keys });
  }

  /**
   * Send mouse movement
   * @param {number} x - X coordinate delta
   * @param {number} y - Y coordinate delta
   * @returns {Promise<void>}
   */
  sendMouseMove(x, y) {
    return this.request('POST', '/api/hid/events/send_mouse_move', { x, y });
  }

  /**
   * Send mouse button event
   * @param {string} button - Button name (left, right, middle)
   * @param {boolean} state - Button state (true=press, false=release)
   * @returns {Promise<void>}
   */
  sendMouseButton(button, state) {
    return this.request('POST', '/api/hid/events/send_mouse_button', { button, state });
  }

  /**
   * Send mouse wheel event
   * @param {number} delta - Wheel delta
   * @returns {Promise<void>}
   */
  sendMouseWheel(delta) {
    return this.request('POST', '/api/hid/events/send_mouse_wheel', { delta });
  }

  /**
   * Get GPIO state
   * @returns {Promise<Object>}
   */
  getGPIO() {
    return this.request('GET', '/api/gpio');
  }

  /**
   * Set GPIO channel state
   * @param {string} channel - Channel name
   * @param {boolean} state - State to set
   * @returns {Promise<void>}
   */
  setGPIO(channel, state) {
    return this.request('POST', '/api/gpio/switch', { channel, state });
  }

  /**
   * Pulse GPIO channel
   * @param {string} channel - Channel name
   * @param {number} [delay=0] - Delay in seconds
   * @returns {Promise<void>}
   */
  pulseGPIO(channel, delay = 0) {
    return this.request('POST', '/api/gpio/pulse', { channel, delay });
  }
}

module.exports = {
  PiKVMClient,
  ATXButton,
  ATXPowerState
};
