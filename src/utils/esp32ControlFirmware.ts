
export const esp32ControlFirmware = `
/**
 * ESP32 GPIO Control Firmware
 * 
 * This firmware enables configurable logic rules for ESP32 GPIO pins
 * and provides communication over USB serial for a web interface.
 * 
 * Hardware Requirements:
 * - ESP32 development board
 * - USB cable for communication and power
 * - LEDs with current-limiting resistors on output pins (optional)
 * - Switches or buttons on input pins (optional)
 * 
 * Pin Configuration:
 * - Output pins (TX1-TX4): GPIO 16, 17, 18, 19
 * - Input pins (SYNC1-SYNC4): GPIO 32, 33, 34, 35
 * 
 * Communication Protocol:
 * Commands:
 * - GET_GPIO_STATE: Request current state of all GPIO pins
 * - SET_GPIO:pin:value - Set a specific GPIO pin (e.g., SET_GPIO:16:1)
 * - SET_LOGIC:output:type:inputs:enabled - Configure logic rule
 *   (e.g., SET_LOGIC:16:AND:32,33:1)
 * 
 * Responses:
 * - GPIO:pin:value - Reports GPIO state (e.g., GPIO:32:1)
 * - LOGIC:output:type:inputs:enabled - Reports logic rule
 * - ERROR:message - Reports an error condition
 */

#include <Arduino.h>

// Define GPIO pins
// Output pins
#define TX1_PIN 16
#define TX2_PIN 17
#define TX3_PIN 18
#define TX4_PIN 19

// Input pins
#define SYNC1_PIN 32
#define SYNC2_PIN 33
#define SYNC3_PIN 34
#define SYNC4_PIN 35

// ADC pins
#define ADC1_PIN 36
#define ADC2_PIN 39

// Logic rule structure
struct LogicRule {
  int outputPin;
  String type; // AND, OR, XOR, NOT, NAND, NOR
  int inputPins[4]; // Max 4 input pins
  int inputPinCount;
  bool enabled;
};

// Global variables
LogicRule logicRules[4]; // Support up to 4 logic rules
bool manualOverride[4] = {false, false, false, false}; // For TX1-TX4
int adcValues[2] = {0, 0}; // ADC readings

unsigned long lastReportTime = 0;
const unsigned long reportInterval = 1000; // 1 second reporting interval

// Function prototypes
void setupGPIO();
void setupLogicRules();
void processSerialCommands();
void updateOutputs();
void reportGPIOState();
void reportLogicRules();
bool evaluateLogicRule(LogicRule rule);
void handleCommand(String command);

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  Serial.println("ESP32 GPIO Control Firmware");
  Serial.println("Version 1.0");

  // Set up GPIO pins
  setupGPIO();
  
  // Set up default logic rules
  setupLogicRules();
  
  // Report initial state
  reportGPIOState();
  reportLogicRules();
}

void loop() {
  // Process any incoming serial commands
  processSerialCommands();
  
  // Update outputs based on logic rules (unless manually overridden)
  updateOutputs();
  
  // Periodically report GPIO states
  if (millis() - lastReportTime > reportInterval) {
    reportGPIOState();
    lastReportTime = millis();
  }
  
  // Small delay to prevent excessive CPU usage
  delay(10);
}

void setupGPIO() {
  // Set pin modes
  // Output pins
  pinMode(TX1_PIN, OUTPUT);
  pinMode(TX2_PIN, OUTPUT);
  pinMode(TX3_PIN, OUTPUT);
  pinMode(TX4_PIN, OUTPUT);
  
  // Input pins with pullup resistors
  pinMode(SYNC1_PIN, INPUT_PULLUP);
  pinMode(SYNC2_PIN, INPUT_PULLUP);
  pinMode(SYNC3_PIN, INPUT_PULLUP);
  pinMode(SYNC4_PIN, INPUT_PULLUP);
  
  // Initialize outputs to LOW
  digitalWrite(TX1_PIN, LOW);
  digitalWrite(TX2_PIN, LOW);
  digitalWrite(TX3_PIN, LOW);
  digitalWrite(TX4_PIN, LOW);
  
  Serial.println("GPIO pins initialized");
}

void setupLogicRules() {
  // Default rule: TX1 = SYNC1 AND SYNC2
  logicRules[0].outputPin = TX1_PIN;
  logicRules[0].type = "AND";
  logicRules[0].inputPins[0] = SYNC1_PIN;
  logicRules[0].inputPins[1] = SYNC2_PIN;
  logicRules[0].inputPinCount = 2;
  logicRules[0].enabled = false;
  
  // Default rule: TX2 = SYNC3 OR SYNC4
  logicRules[1].outputPin = TX2_PIN;
  logicRules[1].type = "OR";
  logicRules[1].inputPins[0] = SYNC3_PIN;
  logicRules[1].inputPins[1] = SYNC4_PIN;
  logicRules[1].inputPinCount = 2;
  logicRules[1].enabled = false;
  
  // Default rule: TX3 = SYNC1 XOR SYNC3
  logicRules[2].outputPin = TX3_PIN;
  logicRules[2].type = "XOR";
  logicRules[2].inputPins[0] = SYNC1_PIN;
  logicRules[2].inputPins[1] = SYNC3_PIN;
  logicRules[2].inputPinCount = 2;
  logicRules[2].enabled = false;
  
  // Default rule: TX4 = NOT SYNC4
  logicRules[3].outputPin = TX4_PIN;
  logicRules[3].type = "NOT";
  logicRules[3].inputPins[0] = SYNC4_PIN;
  logicRules[3].inputPinCount = 1;
  logicRules[3].enabled = false;
  
  Serial.println("Default logic rules configured");
}

void processSerialCommands() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\\n');
    command.trim();
    
    if (command.length() > 0) {
      handleCommand(command);
    }
  }
}

void handleCommand(String command) {
  Serial.print("Received command: ");
  Serial.println(command);
  
  if (command == "GET_GPIO_STATE") {
    reportGPIOState();
    return;
  }
  
  if (command.startsWith("SET_GPIO:")) {
    // Format: SET_GPIO:pin:value
    int firstColon = command.indexOf(':');
    int secondColon = command.indexOf(':', firstColon + 1);
    
    if (firstColon != -1 && secondColon != -1) {
      String pinStr = command.substring(firstColon + 1, secondColon);
      String valueStr = command.substring(secondColon + 1);
      
      int pin = pinStr.toInt();
      int value = valueStr.toInt();
      
      // Check if this is an output pin
      if (pin == TX1_PIN || pin == TX2_PIN || pin == TX3_PIN || pin == TX4_PIN) {
        digitalWrite(pin, value);
        
        // Set manual override for this pin
        int pinIndex = -1;
        if (pin == TX1_PIN) pinIndex = 0;
        else if (pin == TX2_PIN) pinIndex = 1;
        else if (pin == TX3_PIN) pinIndex = 2;
        else if (pin == TX4_PIN) pinIndex = 3;
        
        if (pinIndex != -1) {
          manualOverride[pinIndex] = true;
        }
        
        Serial.print("GPIO:");
        Serial.print(pin);
        Serial.print(":");
        Serial.println(value);
      } else {
        Serial.print("ERROR:Invalid output pin ");
        Serial.println(pin);
      }
    } else {
      Serial.println("ERROR:Invalid SET_GPIO command format");
    }
    return;
  }
  
  if (command.startsWith("SET_LOGIC:")) {
    // Format: SET_LOGIC:output:type:inputs:enabled
    int colonPos[4];
    colonPos[0] = command.indexOf(':');
    colonPos[1] = command.indexOf(':', colonPos[0] + 1);
    colonPos[2] = command.indexOf(':', colonPos[1] + 1);
    colonPos[3] = command.indexOf(':', colonPos[2] + 1);
    
    if (colonPos[0] != -1 && colonPos[1] != -1 && colonPos[2] != -1 && colonPos[3] != -1) {
      int outputPin = command.substring(colonPos[0] + 1, colonPos[1]).toInt();
      String type = command.substring(colonPos[1] + 1, colonPos[2]);
      String inputsStr = command.substring(colonPos[2] + 1, colonPos[3]);
      bool enabled = command.substring(colonPos[3] + 1).toInt() == 1;
      
      // Find which rule index to update
      int ruleIndex = -1;
      for (int i = 0; i < 4; i++) {
        if (logicRules[i].outputPin == outputPin) {
          ruleIndex = i;
          break;
        }
      }
      
      if (ruleIndex == -1) {
        // Find first available rule or overwrite rule 0 if all are used
        for (int i = 0; i < 4; i++) {
          if (!logicRules[i].enabled) {
            ruleIndex = i;
            break;
          }
        }
        if (ruleIndex == -1) ruleIndex = 0; // Overwrite first rule if all are used
      }
      
      // Update rule
      logicRules[ruleIndex].outputPin = outputPin;
      logicRules[ruleIndex].type = type;
      logicRules[ruleIndex].enabled = enabled;
      
      // Parse input pins
      int inputCount = 0;
      int commaPos = -1;
      int startPos = 0;
      
      do {
        commaPos = inputsStr.indexOf(',', startPos);
        String pinStr;
        
        if (commaPos == -1) {
          pinStr = inputsStr.substring(startPos);
        } else {
          pinStr = inputsStr.substring(startPos, commaPos);
          startPos = commaPos + 1;
        }
        
        if (pinStr.length() > 0 && inputCount < 4) {
          logicRules[ruleIndex].inputPins[inputCount] = pinStr.toInt();
          inputCount++;
        }
      } while (commaPos != -1 && inputCount < 4);
      
      logicRules[ruleIndex].inputPinCount = inputCount;
      
      // Clear manual override for this output pin
      if (outputPin == TX1_PIN) manualOverride[0] = false;
      else if (outputPin == TX2_PIN) manualOverride[1] = false;
      else if (outputPin == TX3_PIN) manualOverride[2] = false;
      else if (outputPin == TX4_PIN) manualOverride[3] = false;
      
      // Report the updated rule
      Serial.print("LOGIC:");
      Serial.print(logicRules[ruleIndex].outputPin);
      Serial.print(":");
      Serial.print(logicRules[ruleIndex].type);
      Serial.print(":");
      
      for (int i = 0; i < logicRules[ruleIndex].inputPinCount; i++) {
        if (i > 0) Serial.print(",");
        Serial.print(logicRules[ruleIndex].inputPins[i]);
      }
      
      Serial.print(":");
      Serial.println(logicRules[ruleIndex].enabled ? "1" : "0");
    } else {
      Serial.println("ERROR:Invalid SET_LOGIC command format");
    }
    return;
  }
  
  // If we got here, the command was not recognized
  Serial.print("ERROR:Unknown command: ");
  Serial.println(command);
}

void updateOutputs() {
  // Apply logic rules to outputs (if enabled and not manually overridden)
  for (int i = 0; i < 4; i++) {
    int outputPinIndex = -1;
    if (logicRules[i].outputPin == TX1_PIN) outputPinIndex = 0;
    else if (logicRules[i].outputPin == TX2_PIN) outputPinIndex = 1;
    else if (logicRules[i].outputPin == TX3_PIN) outputPinIndex = 2;
    else if (logicRules[i].outputPin == TX4_PIN) outputPinIndex = 3;
    
    if (outputPinIndex != -1 && logicRules[i].enabled && !manualOverride[outputPinIndex]) {
      bool result = evaluateLogicRule(logicRules[i]);
      digitalWrite(logicRules[i].outputPin, result);
    }
  }
  
  // Read and update ADC values
  adcValues[0] = analogRead(ADC1_PIN);
  adcValues[1] = analogRead(ADC2_PIN);
}

bool evaluateLogicRule(LogicRule rule) {
  bool result = false;
  
  if (rule.type == "AND") {
    // All inputs must be HIGH
    result = true;
    for (int i = 0; i < rule.inputPinCount; i++) {
      if (digitalRead(rule.inputPins[i]) == LOW) {
        result = false;
        break;
      }
    }
  } else if (rule.type == "OR") {
    // At least one input must be HIGH
    result = false;
    for (int i = 0; i < rule.inputPinCount; i++) {
      if (digitalRead(rule.inputPins[i]) == HIGH) {
        result = true;
        break;
      }
    }
  } else if (rule.type == "XOR") {
    // Odd number of HIGH inputs
    int highCount = 0;
    for (int i = 0; i < rule.inputPinCount; i++) {
      if (digitalRead(rule.inputPins[i]) == HIGH) {
        highCount++;
      }
    }
    result = (highCount % 2) == 1;
  } else if (rule.type == "NOT") {
    // Invert input (use first input only)
    if (rule.inputPinCount > 0) {
      result = digitalRead(rule.inputPins[0]) == LOW;
    }
  } else if (rule.type == "NAND") {
    // NOT of AND
    result = true;
    for (int i = 0; i < rule.inputPinCount; i++) {
      if (digitalRead(rule.inputPins[i]) == LOW) {
        result = false;
        break;
      }
    }
    result = !result;
  } else if (rule.type == "NOR") {
    // NOT of OR
    result = false;
    for (int i = 0; i < rule.inputPinCount; i++) {
      if (digitalRead(rule.inputPins[i]) == HIGH) {
        result = true;
        break;
      }
    }
    result = !result;
  }
  
  return result;
}

void reportGPIOState() {
  // Report input pins
  Serial.print("GPIO:");
  Serial.print(SYNC1_PIN);
  Serial.print(":");
  Serial.println(digitalRead(SYNC1_PIN));
  
  Serial.print("GPIO:");
  Serial.print(SYNC2_PIN);
  Serial.print(":");
  Serial.println(digitalRead(SYNC2_PIN));
  
  Serial.print("GPIO:");
  Serial.print(SYNC3_PIN);
  Serial.print(":");
  Serial.println(digitalRead(SYNC3_PIN));
  
  Serial.print("GPIO:");
  Serial.print(SYNC4_PIN);
  Serial.print(":");
  Serial.println(digitalRead(SYNC4_PIN));
  
  // Report output pins
  Serial.print("GPIO:");
  Serial.print(TX1_PIN);
  Serial.print(":");
  Serial.println(digitalRead(TX1_PIN));
  
  Serial.print("GPIO:");
  Serial.print(TX2_PIN);
  Serial.print(":");
  Serial.println(digitalRead(TX2_PIN));
  
  Serial.print("GPIO:");
  Serial.print(TX3_PIN);
  Serial.print(":");
  Serial.println(digitalRead(TX3_PIN));
  
  Serial.print("GPIO:");
  Serial.print(TX4_PIN);
  Serial.print(":");
  Serial.println(digitalRead(TX4_PIN));
  
  // Report ADC values
  Serial.print("ADC:");
  Serial.print(ADC1_PIN);
  Serial.print(":");
  Serial.println(adcValues[0]);
  
  Serial.print("ADC:");
  Serial.print(ADC2_PIN);
  Serial.print(":");
  Serial.println(adcValues[1]);
}

void reportLogicRules() {
  for (int i = 0; i < 4; i++) {
    Serial.print("LOGIC:");
    Serial.print(logicRules[i].outputPin);
    Serial.print(":");
    Serial.print(logicRules[i].type);
    Serial.print(":");
    
    for (int j = 0; j < logicRules[i].inputPinCount; j++) {
      if (j > 0) Serial.print(",");
      Serial.print(logicRules[i].inputPins[j]);
    }
    
    Serial.print(":");
    Serial.println(logicRules[i].enabled ? "1" : "0");
  }
}
`;
