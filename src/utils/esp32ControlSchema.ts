
export interface ESP32Device {
  id: string;
  name: string;
  description: string;
  port: string;
  baudRate: number;
  lastConnected: string;
  createdAt: string;
  userId: string;
}

export interface GPIOPin {
  id: string;
  deviceId: string;
  pin: number;
  name: string;
  type: 'input' | 'output';
  value: boolean;
  lastUpdated: string;
}

export interface LogicRule {
  id: string;
  deviceId: string;
  outputPin: number;
  conditionType: 'AND' | 'OR' | 'XOR' | 'NOT' | 'NAND' | 'NOR';
  inputPins: number[];
  enabled: boolean;
  lastUpdated: string;
}

export interface ADCReading {
  id: string;
  deviceId: string;
  pin: number;
  value: number;
  timestamp: string;
}

// Wiring diagram reference data
export const wiringDiagram = {
  outputPins: [
    { pin: 16, name: 'TX1', description: 'Digital output 1' },
    { pin: 17, name: 'TX2', description: 'Digital output 2' },
    { pin: 18, name: 'TX3', description: 'Digital output 3' },
    { pin: 19, name: 'TX4', description: 'Digital output 4' }
  ],
  inputPins: [
    { pin: 32, name: 'SYNC1', description: 'Digital input 1 with pull-up resistor' },
    { pin: 33, name: 'SYNC2', description: 'Digital input 2 with pull-up resistor' },
    { pin: 34, name: 'SYNC3', description: 'Digital input 3 with pull-up resistor' },
    { pin: 35, name: 'SYNC4', description: 'Digital input 4 with pull-up resistor' }
  ],
  adcPins: [
    { pin: 36, name: 'ADC1', description: 'Analog input 1 (0-3.3V)' },
    { pin: 39, name: 'ADC2', description: 'Analog input 2 (0-3.3V)' }
  ],
  connections: [
    { from: 'TX1', to: 'LED with 330 ohm resistor to GND' },
    { from: 'TX2', to: 'LED with 330 ohm resistor to GND' },
    { from: 'TX3', to: 'LED with 330 ohm resistor to GND' },
    { from: 'TX4', to: 'LED with 330 ohm resistor to GND' },
    { from: 'SYNC1', to: 'Switch or button to GND' },
    { from: 'SYNC2', to: 'Switch or button to GND' },
    { from: 'SYNC3', to: 'Switch or button to GND' },
    { from: 'SYNC4', to: 'Switch or button to GND' }
  ]
};

// Example logic rule documentation
export const logicRuleExamples = [
  {
    title: "AND Logic Rule",
    description: "Output TX1 will be HIGH only when both SYNC1 and SYNC2 are HIGH",
    rule: {
      outputPin: 16, // TX1
      conditionType: 'AND',
      inputPins: [32, 33], // SYNC1, SYNC2
      enabled: true
    },
    testCases: [
      { inputs: "SYNC1=HIGH, SYNC2=HIGH", result: "TX1=HIGH" },
      { inputs: "SYNC1=HIGH, SYNC2=LOW", result: "TX1=LOW" },
      { inputs: "SYNC1=LOW, SYNC2=HIGH", result: "TX1=LOW" },
      { inputs: "SYNC1=LOW, SYNC2=LOW", result: "TX1=LOW" }
    ]
  },
  {
    title: "OR Logic Rule",
    description: "Output TX2 will be HIGH when either SYNC3 or SYNC4 is HIGH",
    rule: {
      outputPin: 17, // TX2
      conditionType: 'OR',
      inputPins: [34, 35], // SYNC3, SYNC4
      enabled: true
    },
    testCases: [
      { inputs: "SYNC3=HIGH, SYNC4=HIGH", result: "TX2=HIGH" },
      { inputs: "SYNC3=HIGH, SYNC4=LOW", result: "TX2=HIGH" },
      { inputs: "SYNC3=LOW, SYNC4=HIGH", result: "TX2=HIGH" },
      { inputs: "SYNC3=LOW, SYNC4=LOW", result: "TX2=LOW" }
    ]
  },
  {
    title: "XOR Logic Rule",
    description: "Output TX3 will be HIGH when SYNC1 and SYNC3 have different states",
    rule: {
      outputPin: 18, // TX3
      conditionType: 'XOR',
      inputPins: [32, 34], // SYNC1, SYNC3
      enabled: true
    },
    testCases: [
      { inputs: "SYNC1=HIGH, SYNC3=HIGH", result: "TX3=LOW" },
      { inputs: "SYNC1=HIGH, SYNC3=LOW", result: "TX3=HIGH" },
      { inputs: "SYNC1=LOW, SYNC3=HIGH", result: "TX3=HIGH" },
      { inputs: "SYNC1=LOW, SYNC3=LOW", result: "TX3=LOW" }
    ]
  },
  {
    title: "NOT Logic Rule",
    description: "Output TX4 will be the opposite of SYNC4's state",
    rule: {
      outputPin: 19, // TX4
      conditionType: 'NOT',
      inputPins: [35], // SYNC4
      enabled: true
    },
    testCases: [
      { inputs: "SYNC4=HIGH", result: "TX4=LOW" },
      { inputs: "SYNC4=LOW", result: "TX4=HIGH" }
    ]
  }
];
