import { DailyTransport } from "@daily-co/realtime-ai-daily";
import { Transport, TransportState, Tracks } from "realtime-ai";

export class DailyTransportAdapter extends Transport {
  private dailyTransport: DailyTransport;

  constructor() {
    super();
    this.dailyTransport = new DailyTransport();
  }

  async initialize(data: any, options: any): Promise<void> {
    return this.dailyTransport.initialize(data, options);
  }

  async initDevices(): Promise<void> {
    return this.dailyTransport.initDevices();
  }

  async connect(data: any, options: any): Promise<void> {
    return this.dailyTransport.connect(data, options);
  }

  async disconnect(): Promise<void> {
    return this.dailyTransport.disconnect();
  }

  async getAllMics(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices()
      .then(devices => devices.filter(d => d.kind === 'audioinput'));
  }

  async getAllCams(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices()
      .then(devices => devices.filter(d => d.kind === 'videoinput'));
  }

  async getAllSpeakers(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices()
      .then(devices => devices.filter(d => d.kind === 'audiooutput'));
  }

  async updateMic(): Promise<void> {}
  async updateCam(): Promise<void> {}
  async updateSpeaker(): Promise<void> {}
  async sendReadyMessage(): Promise<void> {}
  async enableMic(): Promise<void> {}
  async disableMic(): Promise<void> {}
  async enableCam(): Promise<void> {}
  async disableCam(): Promise<void> {}

  get selectedMic(): MediaDeviceInfo | Record<string, never> { return {}; }
  get selectedCam(): MediaDeviceInfo | Record<string, never> { return {}; }
  get selectedSpeaker(): MediaDeviceInfo | Record<string, never> { return {}; }

  async sendMessage(message: any): Promise<void> {
    return this.dailyTransport.sendMessage(message);
  }

  get isCamEnabled(): boolean {
    return false;
  }

  get isMicEnabled(): boolean {
    return false;
  }

  get state(): TransportState {
    return 'connected' as TransportState;
  }

  tracks(): Tracks {
    return {
      local: { audio: undefined, video: undefined }
    };
  }
} 