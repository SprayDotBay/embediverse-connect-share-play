
export interface BleDeviceInfo {
  device: BluetoothDevice;
  name: string;
  id: string;
  connected: boolean;
  services?: BluetoothRemoteGATTService[];
}

export interface BleCharacteristic {
  uuid: string;
  service: BluetoothRemoteGATTService;
  characteristic: BluetoothRemoteGATTCharacteristic;
}

export interface BleDevice {
  id: string;
  name: string;
  rssi: number;
}

export interface BleScanOptions {
  serviceUUIDs?: string[];
}

export interface BleConnectionOptions {
  autoConnect?: boolean;
}

export interface BleWriteOptions {
  withResponse?: boolean;
}
