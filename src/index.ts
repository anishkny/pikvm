import * as http from 'http';
import * as https from 'https';

/**
 * Configuration options for PiKVM client
 */
export interface PiKVMConfig {
  /** PiKVM hostname or IP address */
  host: string;
  /** Port number (default: 443 for HTTPS, 80 for HTTP) */
  port?: number;
  /** Use HTTPS (default: true) */
  secure?: boolean;
  /** Username for authentication */
  username: string;
  /** Password for authentication */
  password: string;
  /** Reject unauthorized SSL certificates (default: false) */
  rejectUnauthorized?: boolean;
}

/**
 * ATX power states
 */
export enum ATXPowerState {
  ON = 'on',
  OFF = 'off',
}

/**
 * ATX button actions
 */
export enum ATXButton {
  POWER = 'power',
  POWER_LONG = 'power_long',
  RESET = 'reset',
}

/**
 * Response from ATX info endpoint
 */
export interface ATXInfo {
  enabled: boolean;
  busy: boolean;
  leds?: {
    power?: boolean;
    hdd?: boolean;
  };
}

/**
 * Response from info endpoint
 */
export interface SystemInfo {
  meta?: {
    server?: string;
    kvm?: Record<string, any>;
  };
  system?: Record<string, any>;
  hw?: Record<string, any>;
  extras?: Record<string, any>;
}

/**
 * MSD (Mass Storage Device) image info
 */
export interface MSDImage {
  name: string;
  size: number;
  complete: boolean;
}

/**
 * MSD state information
 */
export interface MSDInfo {
  enabled: boolean;
  online: boolean;
  busy: boolean;
  storage?: {
    size: number;
    free: number;
    images: Record<string, MSDImage>;
  };
  drive?: {
    image: string | null;
    connected: boolean;
    cdrom: boolean;
  };
}

/**
 * GPIO channel information
 */
export interface GPIOChannel {
  mode: string;
  state: boolean;
}

/**
 * GPIO state information
 */
export interface GPIOInfo {
  enabled: boolean;
  drivers: Record<string, any>;
  inputs: Record<string, GPIOChannel>;
  outputs: Record<string, GPIOChannel>;
}

/**
 * Main PiKVM client class
 */
export class PiKVMClient {
  private config: Required<PiKVMConfig>;
  private authHeader: string;

  /**
   * Create a new PiKVM client instance
   * @param config Configuration options
   */
  constructor(config: PiKVMConfig) {
    this.config = {
      host: config.host,
      port: config.port || (config.secure !== false ? 443 : 80),
      secure: config.secure !== false,
      username: config.username,
      password: config.password,
      rejectUnauthorized: config.rejectUnauthorized || false,
    };

    // Create base64 encoded auth header
    const auth = Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64');
    this.authHeader = `Basic ${auth}`;
  }

  /**
   * Make an HTTP request to PiKVM API
   */
  private request<T>(method: string, path: string, body?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const options: https.RequestOptions = {
        hostname: this.config.host,
        port: this.config.port,
        path,
        method,
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json',
        },
        rejectUnauthorized: this.config.rejectUnauthorized,
      };

      const client = this.config.secure ? https : http;
      
      const req = client.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = data ? JSON.parse(data) : {};
              resolve(parsed);
            } catch (e) {
              resolve(data as any);
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
   */
  async getInfo(): Promise<SystemInfo> {
    return this.request<SystemInfo>('GET', '/api/info');
  }

  /**
   * Get ATX power state information
   */
  async getATXInfo(): Promise<ATXInfo> {
    return this.request<ATXInfo>('GET', '/api/atx');
  }

  /**
   * Click ATX button (power, reset, etc.)
   * @param button Button to click
   * @param wait Wait for completion (default: true)
   */
  async clickATXButton(button: ATXButton, wait: boolean = true): Promise<void> {
    await this.request('POST', `/api/atx/click?button=${button}&wait=${wait ? '1' : '0'}`, {});
  }

  /**
   * Power on the system
   */
  async powerOn(): Promise<void> {
    await this.clickATXButton(ATXButton.POWER);
  }

  /**
   * Power off the system (short press)
   */
  async powerOff(): Promise<void> {
    await this.clickATXButton(ATXButton.POWER);
  }

  /**
   * Force power off (long press)
   */
  async forcePowerOff(): Promise<void> {
    await this.clickATXButton(ATXButton.POWER_LONG);
  }

  /**
   * Reset the system
   */
  async reset(): Promise<void> {
    await this.clickATXButton(ATXButton.RESET);
  }

  /**
   * Get MSD (Mass Storage Device) information
   */
  async getMSDInfo(): Promise<MSDInfo> {
    return this.request<MSDInfo>('GET', '/api/msd');
  }

  /**
   * Set MSD image
   * @param image Image name or null to disconnect
   * @param cdrom Mount as CD-ROM (default: false)
   */
  async setMSDImage(image: string | null, cdrom: boolean = false): Promise<void> {
    await this.request('POST', '/api/msd/set_params', {
      image,
      cdrom,
    });
  }

  /**
   * Connect MSD
   */
  async connectMSD(): Promise<void> {
    await this.request('POST', '/api/msd/set_connected', { connected: true });
  }

  /**
   * Disconnect MSD
   */
  async disconnectMSD(): Promise<void> {
    await this.request('POST', '/api/msd/set_connected', { connected: false });
  }

  /**
   * Write MSD image (upload)
   * Note: This is a simplified version. For actual file upload, use multipart/form-data
   * @param image Image name
   * @param data Image data
   */
  async writeMSDImage(image: string, data: Buffer): Promise<void> {
    // This would require multipart/form-data handling
    // Simplified for now - users should implement based on their needs
    throw new Error('MSD image upload not implemented - use HTTP multipart/form-data directly');
  }

  /**
   * Remove MSD image
   * @param image Image name
   */
  async removeMSDImage(image: string): Promise<void> {
    await this.request('POST', `/api/msd/remove?image=${encodeURIComponent(image)}`, {});
  }

  /**
   * Send keyboard keys
   * @param keys Array of key codes to send
   */
  async sendKeys(keys: string[]): Promise<void> {
    await this.request('POST', '/api/hid/events/send_key', { keys });
  }

  /**
   * Send mouse movement
   * @param x X coordinate delta
   * @param y Y coordinate delta
   */
  async sendMouseMove(x: number, y: number): Promise<void> {
    await this.request('POST', '/api/hid/events/send_mouse_move', { x, y });
  }

  /**
   * Send mouse button event
   * @param button Button name ('left', 'right', 'middle')
   * @param state Button state (true for press, false for release)
   */
  async sendMouseButton(button: string, state: boolean): Promise<void> {
    await this.request('POST', '/api/hid/events/send_mouse_button', { button, state });
  }

  /**
   * Send mouse wheel event
   * @param delta Wheel delta
   */
  async sendMouseWheel(delta: number): Promise<void> {
    await this.request('POST', '/api/hid/events/send_mouse_wheel', { delta });
  }

  /**
   * Get GPIO state
   */
  async getGPIO(): Promise<GPIOInfo> {
    return this.request<GPIOInfo>('GET', '/api/gpio');
  }

  /**
   * Set GPIO channel state
   * @param channel Channel name
   * @param state State to set
   */
  async setGPIO(channel: string, state: boolean): Promise<void> {
    await this.request('POST', '/api/gpio/switch', { channel, state });
  }

  /**
   * Pulse GPIO channel
   * @param channel Channel name
   * @param delay Delay in seconds
   */
  async pulseGPIO(channel: string, delay: number = 0): Promise<void> {
    await this.request('POST', '/api/gpio/pulse', { channel, delay });
  }
}
