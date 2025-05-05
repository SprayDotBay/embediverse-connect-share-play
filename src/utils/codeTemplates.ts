
export const arduinoTemplate = `// Basic Arduino template
void setup() {
  // Initialize serial communication at 9600 bits per second
  Serial.begin(9600);
  // Initialize digital pin LED_BUILTIN as an output
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // Turn the LED on (HIGH is the voltage level)
  digitalWrite(LED_BUILTIN, HIGH);
  // Print to serial monitor
  Serial.println("LED ON");
  // Wait for a second
  delay(1000);
  // Turn the LED off by making the voltage LOW
  digitalWrite(LED_BUILTIN, LOW);
  // Print to serial monitor
  Serial.println("LED OFF");
  // Wait for a second
  delay(1000);
}`;

export const esp32Template = `// ESP32 template with GPIO monitoring
#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <GPIOViewer.h>

// Define your GPIO pins
#define TX1_PIN 16  // Output pin 1
#define TX2_PIN 17  // Output pin 2
#define TX3_PIN 18  // Output pin 3
#define TX4_PIN 19  // Output pin 4

#define SYNC1_PIN 32  // Input pin 1
#define SYNC2_PIN 33  // Input pin 2
#define SYNC3_PIN 34  // Input pin 3
#define SYNC4_PIN 35  // Input pin 4

// Initialize GPIO viewer
GPIOViewer gpioViewer;

void setup() {
  Serial.begin(115200);
  
  // Initialize output pins
  pinMode(TX1_PIN, OUTPUT);
  pinMode(TX2_PIN, OUTPUT);
  pinMode(TX3_PIN, OUTPUT);
  pinMode(TX4_PIN, OUTPUT);
  
  // Initialize input pins with pull-up resistors
  pinMode(SYNC1_PIN, INPUT_PULLUP);
  pinMode(SYNC2_PIN, INPUT_PULLUP);
  pinMode(SYNC3_PIN, INPUT_PULLUP);
  pinMode(SYNC4_PIN, INPUT_PULLUP);
  
  // Register pins with GPIOViewer
  gpioViewer.begin();
  gpioViewer.addOutputPin(TX1_PIN, "TX1");
  gpioViewer.addOutputPin(TX2_PIN, "TX2");
  gpioViewer.addOutputPin(TX3_PIN, "TX3");
  gpioViewer.addOutputPin(TX4_PIN, "TX4");
  
  gpioViewer.addInputPin(SYNC1_PIN, "SYNC1");
  gpioViewer.addInputPin(SYNC2_PIN, "SYNC2");
  gpioViewer.addInputPin(SYNC3_PIN, "SYNC3");
  gpioViewer.addInputPin(SYNC4_PIN, "SYNC4");
  
  Serial.println("ESP32 GPIO Monitor initialized");
}

void loop() {
  // Update GPIO states in the viewer
  gpioViewer.update();
  
  // Logic linking inputs to outputs (example)
  digitalWrite(TX1_PIN, digitalRead(SYNC1_PIN));
  digitalWrite(TX2_PIN, digitalRead(SYNC2_PIN));
  digitalWrite(TX3_PIN, digitalRead(SYNC3_PIN));
  digitalWrite(TX4_PIN, digitalRead(SYNC4_PIN));
  
  delay(100); // Small delay to prevent flooding
}`;

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  if (parts.length === 1) return '';
  return parts[parts.length - 1].toLowerCase();
};

export const getLanguageFromFile = (filename: string): string => {
  const ext = getFileExtension(filename);
  switch (ext) {
    case 'ino':
    case 'cpp':
    case 'h':
      return 'cpp';
    case 'py':
      return 'python';
    case 'js':
      return 'javascript';
    case 'json':
      return 'json';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    default:
      return 'plaintext';
  }
};
