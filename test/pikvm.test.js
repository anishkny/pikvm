const { expect } = require('chai');
const nock = require('nock');
const { PiKVMClient, ATXButton, ATXPowerState } = require('../lib/index');

describe('PiKVMClient', function() {
  let client;
  const testHost = 'pikvm.local';
  const testUsername = 'admin';
  const testPassword = 'admin';

  beforeEach(function() {
    client = new PiKVMClient({
      host: testHost,
      username: testUsername,
      password: testPassword,
      secure: true,
      rejectUnauthorized: false
    });
  });

  afterEach(function() {
    nock.cleanAll();
  });

  describe('Constructor', function() {
    it('should create a client with required parameters', function() {
      expect(client).to.be.an.instanceof(PiKVMClient);
      expect(client.config.host).to.equal(testHost);
      expect(client.config.username).to.equal(testUsername);
      expect(client.config.password).to.equal(testPassword);
    });

    it('should throw error if host is missing', function() {
      expect(() => new PiKVMClient({ username: 'admin', password: 'admin' }))
        .to.throw('host, username, and password are required');
    });

    it('should throw error if username is missing', function() {
      expect(() => new PiKVMClient({ host: 'test', password: 'admin' }))
        .to.throw('host, username, and password are required');
    });

    it('should throw error if password is missing', function() {
      expect(() => new PiKVMClient({ host: 'test', username: 'admin' }))
        .to.throw('host, username, and password are required');
    });

    it('should default to HTTPS on port 443', function() {
      expect(client.config.secure).to.be.true;
      expect(client.config.port).to.equal(443);
    });

    it('should use HTTP on port 80 when secure is false', function() {
      const httpClient = new PiKVMClient({
        host: testHost,
        username: testUsername,
        password: testPassword,
        secure: false
      });
      expect(httpClient.config.secure).to.be.false;
      expect(httpClient.config.port).to.equal(80);
    });

    it('should use custom port when provided', function() {
      const customClient = new PiKVMClient({
        host: testHost,
        username: testUsername,
        password: testPassword,
        port: 8443
      });
      expect(customClient.config.port).to.equal(8443);
    });
  });

  describe('System Information', function() {
    it('should get system info', async function() {
      const mockResponse = {
        meta: { server: 'PiKVM v1.0' },
        system: { hostname: 'pikvm' }
      };

      nock(`https://${testHost}:443`)
        .get('/api/info')
        .reply(200, mockResponse);

      const result = await client.getInfo();
      expect(result).to.deep.equal(mockResponse);
    });
  });

  describe('ATX Power Management', function() {
    it('should get ATX info', async function() {
      const mockResponse = {
        enabled: true,
        busy: false,
        leds: { power: true, hdd: false }
      };

      nock(`https://${testHost}:443`)
        .get('/api/atx')
        .reply(200, mockResponse);

      const result = await client.getATXInfo();
      expect(result).to.deep.equal(mockResponse);
    });

    it('should power on the system', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/atx/click?button=power&wait=1')
        .reply(200, {});

      await client.powerOn();
    });

    it('should power off the system', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/atx/click?button=power&wait=1')
        .reply(200, {});

      await client.powerOff();
    });

    it('should force power off', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/atx/click?button=power_long&wait=1')
        .reply(200, {});

      await client.forcePowerOff();
    });

    it('should reset the system', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/atx/click?button=reset&wait=1')
        .reply(200, {});

      await client.reset();
    });

    it('should click ATX button without waiting', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/atx/click?button=power&wait=0')
        .reply(200, {});

      await client.clickATXButton(ATXButton.POWER, false);
    });
  });

  describe('Mass Storage Device', function() {
    it('should get MSD info', async function() {
      const mockResponse = {
        enabled: true,
        online: true,
        busy: false,
        storage: {
          size: 1000000,
          free: 500000,
          images: {
            'debian.iso': { name: 'debian.iso', size: 500000, complete: true }
          }
        },
        drive: {
          image: null,
          connected: false,
          cdrom: false
        }
      };

      nock(`https://${testHost}:443`)
        .get('/api/msd')
        .reply(200, mockResponse);

      const result = await client.getMSDInfo();
      expect(result).to.deep.equal(mockResponse);
    });

    it('should set MSD image as CD-ROM', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/msd/set_params', { image: 'debian.iso', cdrom: true })
        .reply(200, {});

      await client.setMSDImage('debian.iso', true);
    });

    it('should set MSD image as USB', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/msd/set_params', { image: 'ubuntu.iso', cdrom: false })
        .reply(200, {});

      await client.setMSDImage('ubuntu.iso', false);
    });

    it('should connect MSD', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/msd/set_connected', { connected: true })
        .reply(200, {});

      await client.connectMSD();
    });

    it('should disconnect MSD', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/msd/set_connected', { connected: false })
        .reply(200, {});

      await client.disconnectMSD();
    });

    it('should remove MSD image', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/msd/remove?image=debian.iso')
        .reply(200, {});

      await client.removeMSDImage('debian.iso');
    });
  });

  describe('HID Control', function() {
    it('should send keyboard keys', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/hid/events/send_key', { keys: ['a', 'b', 'c'] })
        .reply(200, {});

      await client.sendKeys(['a', 'b', 'c']);
    });

    it('should send mouse movement', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/hid/events/send_mouse_move', { x: 10, y: 20 })
        .reply(200, {});

      await client.sendMouseMove(10, 20);
    });

    it('should send mouse button press', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/hid/events/send_mouse_button', { button: 'left', state: true })
        .reply(200, {});

      await client.sendMouseButton('left', true);
    });

    it('should send mouse button release', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/hid/events/send_mouse_button', { button: 'left', state: false })
        .reply(200, {});

      await client.sendMouseButton('left', false);
    });

    it('should send mouse wheel event', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/hid/events/send_mouse_wheel', { delta: -1 })
        .reply(200, {});

      await client.sendMouseWheel(-1);
    });
  });

  describe('GPIO', function() {
    it('should get GPIO state', async function() {
      const mockResponse = {
        enabled: true,
        drivers: {},
        inputs: {},
        outputs: {
          'channel1': { mode: 'output', state: false }
        }
      };

      nock(`https://${testHost}:443`)
        .get('/api/gpio')
        .reply(200, mockResponse);

      const result = await client.getGPIO();
      expect(result).to.deep.equal(mockResponse);
    });

    it('should set GPIO channel', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/gpio/switch', { channel: 'channel1', state: true })
        .reply(200, {});

      await client.setGPIO('channel1', true);
    });

    it('should pulse GPIO channel', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/gpio/pulse', { channel: 'channel1', delay: 0.5 })
        .reply(200, {});

      await client.pulseGPIO('channel1', 0.5);
    });

    it('should pulse GPIO channel with default delay', async function() {
      nock(`https://${testHost}:443`)
        .post('/api/gpio/pulse', { channel: 'channel1', delay: 0 })
        .reply(200, {});

      await client.pulseGPIO('channel1');
    });
  });

  describe('Error Handling', function() {
    it('should handle HTTP errors', async function() {
      nock(`https://${testHost}:443`)
        .get('/api/info')
        .reply(401, 'Unauthorized');

      try {
        await client.getInfo();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('HTTP 401');
      }
    });

    it('should handle network errors', async function() {
      nock(`https://${testHost}:443`)
        .get('/api/info')
        .replyWithError('Network error');

      try {
        await client.getInfo();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Network error');
      }
    });

    it('should handle invalid JSON response gracefully', async function() {
      nock(`https://${testHost}:443`)
        .get('/api/info')
        .reply(200, 'OK');

      const result = await client.getInfo();
      expect(result).to.equal('OK');
    });
  });

  describe('Constants', function() {
    it('should export ATXButton constants', function() {
      expect(ATXButton.POWER).to.equal('power');
      expect(ATXButton.POWER_LONG).to.equal('power_long');
      expect(ATXButton.RESET).to.equal('reset');
    });

    it('should export ATXPowerState constants', function() {
      expect(ATXPowerState.ON).to.equal('on');
      expect(ATXPowerState.OFF).to.equal('off');
    });
  });
});
