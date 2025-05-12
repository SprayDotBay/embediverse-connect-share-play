
// ESP32 WiFi Manager firmware template
export const esp32WifiManagerTemplate = `
// ESP32 WiFi Manager Firmware for Embediverse
// Custom WiFi manager with captive portal and OTA updates

#include <Arduino.h>
#include <WiFi.h>
#include <ESPmDNS.h>
#include <WiFiManager.h>
#include <ArduinoJson.h>
#include <Update.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <FS.h>
#include <SPIFFS.h>

// Config
#define CONFIG_FILE "/config.json"
#define AP_SSID "Embediverse-Setup"
#define AP_PASSWORD "embediverse"
#define PORTAL_TIMEOUT 180  // 3 minutes
#define DNS_PORT 53
#define HTTP_PORT 80
#define MAX_NETWORKS 20
`;

// Additional ESP32 firmware code sections
export const esp32WifiManagerConfig = `
// Global variables
WiFiManager wm;
DNSServer dnsServer;
WebServer server(HTTP_PORT);
bool captivePortalEnabled = true;
String portalName = "Embediverse Portal";
String portalTheme = "dark";
bool accessPointMode = false;
String deviceMacAddress = "";
String deviceIpAddress = "0.0.0.0";
unsigned long uptime = 0;
unsigned long startTime = 0;
float cpuTemperature = 0;

// Config struct
struct Config {
  char ssid[32];
  char password[64];
  bool enableCaptivePortal;
  char portalName[32];
  char portalTheme[16];
};

Config config;
`;

export const esp32WifiManagerFunctions = `
// Forward declarations
void setupServer();
void handleRoot();
void handleScan();
void handleConnect();
void handleUpdate();
void handleStatus();
void handleTheme();
bool loadConfig();
void saveConfig();
String getMAC();
float getCpuTemperature();
void startCaptivePortal();
`;

export const esp32WifiManagerSetup = `
void setup() {
  Serial.begin(115200);
  Serial.println("\\n\\nEmbediverse WiFi Manager Starting...");
  
  // Initialize SPIFFS for config storage
  if (!SPIFFS.begin(true)) {
    Serial.println("SPIFFS Mount Failed");
  }
  
  // Load configuration if available
  if (!loadConfig()) {
    Serial.println("Using default configuration");
    // Set defaults
    strcpy(config.ssid, "");
    strcpy(config.password, "");
    config.enableCaptivePortal = true;
    strcpy(config.portalName, "Embediverse Portal");
    strcpy(config.portalTheme, "dark");
    saveConfig();
  }
  
  captivePortalEnabled = config.enableCaptivePortal;
  portalName = String(config.portalName);
  portalTheme = String(config.portalTheme);
  
  // Get MAC address for device ID
  deviceMacAddress = getMAC();
  
  // Initialize WiFiManager
  wm.setDebugOutput(true);
  wm.setConfigPortalTimeout(PORTAL_TIMEOUT);
  wm.setAPStaticIPConfig(IPAddress(192,168,4,1), IPAddress(192,168,4,1), IPAddress(255,255,255,0));
  wm.setMinimumSignalQuality(20);
  wm.setClass("invert"); // Dark theme
  wm.setHostname("embediverse-" + deviceMacAddress.substring(deviceMacAddress.length() - 5));
  
  // Connect to stored WiFi or start AP if can't connect
  if (strlen(config.ssid) > 0) {
    Serial.println("Attempting connection to stored WiFi...");
    WiFi.begin(config.ssid, config.password);
    
    int connectionAttempts = 0;
    while (WiFi.status() != WL_CONNECTED && connectionAttempts < 20) {
      delay(500);
      Serial.print(".");
      connectionAttempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\\nConnected to WiFi!");
      Serial.print("IP address: ");
      deviceIpAddress = WiFi.localIP().toString();
      Serial.println(deviceIpAddress);
      accessPointMode = false;
    } else {
      Serial.println("\\nFailed to connect to WiFi.");
      startCaptivePortal();
    }
  } else {
    Serial.println("No stored credentials, starting captive portal");
    startCaptivePortal();
  }

  // Setup web server endpoints
  setupServer();
  
  // Setup mDNS for easy access
  if (MDNS.begin("embediverse")) {
    Serial.println("mDNS responder started at http://embediverse.local");
  }
  
  // Store startup time
  startTime = millis();
  
  Serial.println("Embediverse WiFi Manager Ready!");
}
`;

// Create a separate file for the WiFi Manager's loop function
export const esp32WifiManagerLoop = `
void loop() {
  // Update uptime
  uptime = millis() - startTime;
  
  // Update CPU temperature occasionally
  static unsigned long lastTemp = 0;
  if (millis() - lastTemp > 10000) {  // Every 10 seconds
    cpuTemperature = getCpuTemperature();
    lastTemp = millis();
  }
  
  // Handle DNS server in AP mode
  if (accessPointMode && captivePortalEnabled) {
    dnsServer.processNextRequest();
  }
  
  // Handle HTTP server
  server.handleClient();
  
  // Process serial commands if available
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\\n');
    command.trim();
    Serial.println("Received command: " + command);
    
    if (command.startsWith("{")) {
      // Try to parse as JSON
      DynamicJsonDocument doc(512);
      DeserializationError error = deserializeJson(doc, command);
      
      if (!error) {
        if (doc.containsKey("command")) {
          String cmd = doc["command"].as<String>();
          
          if (cmd == "scanNetworks") {
            Serial.println("Scanning networks...");
            
            int numNetworks = WiFi.scanNetworks();
            DynamicJsonDocument response(1024);
            JsonArray networks = response.createNestedArray("networks");
            
            for (int i = 0; i < min(numNetworks, MAX_NETWORKS); i++) {
              JsonObject network = networks.createNestedObject();
              network["ssid"] = WiFi.SSID(i);
              network["rssi"] = WiFi.RSSI(i);
              network["secure"] = WiFi.encryptionType(i) != WIFI_AUTH_OPEN;
              network["channel"] = WiFi.channel(i);
            }
            
            String responseStr;
            serializeJson(response, responseStr);
            Serial.println(responseStr);
          }
          else if (cmd == "connectWifi") {
            if (doc.containsKey("ssid") && doc.containsKey("password")) {
              String ssid = doc["ssid"].as<String>();
              String password = doc["password"].as<String>();
              
              Serial.println("Connecting to WiFi: " + ssid);
              
              // Save to config
              ssid.toCharArray(config.ssid, 32);
              password.toCharArray(config.password, 64);
              
              if (doc.containsKey("enableCaptivePortal")) {
                config.enableCaptivePortal = doc["enableCaptivePortal"].as<bool>();
                captivePortalEnabled = config.enableCaptivePortal;
              }
              
              saveConfig();
              
              // Connect to WiFi
              WiFi.begin(ssid.c_str(), password.c_str());
              
              int attempts = 0;
              while (WiFi.status() != WL_CONNECTED && attempts < 20) {
                delay(500);
                Serial.print(".");
                attempts++;
              }
              
              if (WiFi.status() == WL_CONNECTED) {
                Serial.println("\\nConnected successfully!");
                deviceIpAddress = WiFi.localIP().toString();
                Serial.println("IP: " + deviceIpAddress);
                accessPointMode = false;
                
                // Send response
                Serial.println("{\\"status\\":\\"connected\\",\\"ip\\":\\"" + deviceIpAddress + "\\"}");
              } else {
                Serial.println("\\nConnection failed!");
                Serial.println("{\\"status\\":\\"failed\\"}");
              }
            }
          }
          else if (cmd == "disconnectWifi") {
            Serial.println("Disconnecting from WiFi");
            WiFi.disconnect();
            Serial.println("{\\"status\\":\\"disconnected\\"}");
          }
          else if (cmd == "updatePortalSettings") {
            if (doc.containsKey("name")) {
              String name = doc["name"].as<String>();
              name.toCharArray(config.portalName, 32);
              portalName = name;
            }
            
            if (doc.containsKey("theme")) {
              String theme = doc["theme"].as<String>();
              theme.toCharArray(config.portalTheme, 16);
              portalTheme = theme;
            }
            
            if (doc.containsKey("captivePortal")) {
              config.enableCaptivePortal = doc["captivePortal"].as<bool>();
              captivePortalEnabled = config.enableCaptivePortal;
            }
            
            saveConfig();
            Serial.println("{\\"status\\":\\"updated\\"}");
          }
        }
      }
    }
  }
  
  // Short delay
  delay(10);
}
`;

// Setup guide for WiFi manager
export const wifiManagerSetupGuide = `
# ESP32 WiFi Manager Setup Guide

## Prerequisites
1. ESP32 development board
2. USB cable for programming
3. PlatformIO extension for VS Code

## Installation Steps

### Step 1: Create a New PlatformIO Project
1. Open VS Code
2. Navigate to PlatformIO Home
3. Click "New Project"
4. Enter a name (e.g., "EmbediverseWiFiManager")
5. Select "ESP32 Dev Module" as the board
6. Select "Arduino" as the framework
7. Click "Finish"

### Step 2: Configure platformio.ini
Add the following to your platformio.ini file:

\`\`\`
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200
lib_deps = 
    https://github.com/tzapu/WiFiManager.git
    bblanchon/ArduinoJson@^6.21.0
\`\`\`

### Step 3: Copy the WiFi Manager Code
1. Create a file named main.cpp in the src/ directory
2. Copy the ESP32 WiFi Manager code into this file

### Step 4: Upload the Code
1. Connect your ESP32 to your computer
2. Click the "Upload" button in PlatformIO
3. Wait for the code to compile and upload

### Step 5: Testing the WiFi Manager
1. Open the Serial Monitor (115200 baud)
2. Reset your ESP32
3. You should see output indicating the WiFi Manager is running
4. Connect to the "Embediverse-xxxx" WiFi network with password "embediverse"
5. Open a web browser and navigate to 192.168.4.1
6. You should see the WiFi Manager portal

## Features
- Captive portal for easy configuration
- Real-time device status monitoring
- OTA firmware updates
- Custom theming with light/dark modes
- Network scanning and management
- API for programmatic control

## Integration with Embediverse
1. Connect your ESP32 to your computer
2. Open the Embediverse WiFi Manager page
3. Click "Connect Serial" to establish connection
4. Use the WiFi Manager interface to configure your device

## Additional Notes
- The default theme is dark mode
- The captive portal is enabled by default
- All settings are saved to SPIFFS and persist across reboots
- The device will automatically reconnect to previously saved networks
`;
