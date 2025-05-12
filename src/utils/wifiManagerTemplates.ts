
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
                Serial.println("{\\\"status\\\":\\\"connected\\\",\\\"ip\\\":\\\"" + deviceIpAddress + "\\\"}");
              } else {
                Serial.println("\\nConnection failed!");
                Serial.println("{\\\"status\\\":\\\"failed\\\"}");
              }
            }
          }
          else if (cmd == "disconnectWifi") {
            Serial.println("Disconnecting from WiFi");
            WiFi.disconnect();
            Serial.println("{\\\"status\\\":\\\"disconnected\\\"}");
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
            Serial.println("{\\\"status\\\":\\\"updated\\\"}");
          }
        }
      }
    }
  }
  
  // Short delay
  delay(10);
}

void setupServer() {
  // API routes
  server.on("/", handleRoot);
  server.on("/api/scan", HTTP_GET, handleScan);
  server.on("/api/connect", HTTP_POST, handleConnect);
  server.on("/api/status", HTTP_GET, handleStatus);
  server.on("/api/update", HTTP_POST, []() {
    server.sendHeader("Connection", "close");
    server.send(200, "text/plain", Update.hasError() ? "Update failed!" : "Update success!");
    delay(1000);
    ESP.restart();
  }, []() {
    HTTPUpload& upload = server.upload();
    handleUpdate(upload);
  });
  
  // Theme file
  server.on("/theme.css", handleTheme);
  
  // Start server
  server.begin();
  Serial.println("HTTP server started");
}

void handleRoot() {
  String html = "<!DOCTYPE html><html><head>";
  html += "<meta name='viewport' content='width=device-width, initial-scale=1'>";
  html += "<title>" + portalName + "</title>";
  html += "<link rel='stylesheet' href='/theme.css'>";
  html += "</head><body>";
  html += "<div class='container'>";
  html += "<h1>" + portalName + "</h1>";
  
  if (WiFi.status() == WL_CONNECTED) {
    html += "<div class='status connected'>Connected to WiFi</div>";
    html += "<div class='info-grid'>";
    html += "<div><span>SSID:</span> " + String(config.ssid) + "</div>";
    html += "<div><span>IP Address:</span> " + WiFi.localIP().toString() + "</div>";
    html += "<div><span>MAC:</span> " + deviceMacAddress + "</div>";
    html += "<div><span>Signal:</span> " + String(WiFi.RSSI()) + " dBm</div>";
    html += "</div>";
    html += "<button onclick='disconnectWifi()' class='button danger'>Disconnect</button>";
  } else {
    html += "<div class='status disconnected'>Disconnected</div>";
    html += "<div class='card'>";
    html += "<h2>Connect to WiFi</h2>";
    html += "<div class='form-group'>";
    html += "<label for='ssid'>Network Name (SSID)</label>";
    html += "<input type='text' id='ssid' placeholder='Enter SSID'>";
    html += "</div>";
    html += "<div class='form-group'>";
    html += "<label for='password'>Password</label>";
    html += "<input type='password' id='password' placeholder='Enter password'>";
    html += "</div>";
    html += "<button onclick='connectWifi()' class='button primary'>Connect</button>";
    html += "</div>";
  }
  
  html += "<div class='card'>";
  html += "<h2>Available Networks</h2>";
  html += "<div id='network-list'><div class='loading'>Scanning...</div></div>";
  html += "<button onclick='scanNetworks()' class='button secondary'>Refresh</button>";
  html += "</div>";
  
  html += "<div class='card'>";
  html += "<h2>Device Information</h2>";
  html += "<div class='info-grid'>";
  html += "<div><span>Device:</span> ESP32</div>";
  html += "<div><span>MAC Address:</span> " + deviceMacAddress + "</div>";
  html += "<div><span>Uptime:</span> <span id='uptime'></span></div>";
  html += "<div><span>CPU Temp:</span> <span id='cpu-temp'></span></div>";
  html += "</div>";
  html += "</div>";
  
  html += "<div class='footer'>";
  html += "Embediverse WiFi Manager v1.0";
  html += "</div>";
  html += "</div>";

  html += "<script>";
  html += "let uptimeInterval;";
  html += "function formatUptime(ms) {";
  html += "  let seconds = Math.floor(ms / 1000);";
  html += "  let minutes = Math.floor(seconds / 60);";
  html += "  let hours = Math.floor(minutes / 60);";
  html += "  seconds = seconds % 60;";
  html += "  minutes = minutes % 60;";
  html += "  return hours + 'h ' + minutes + 'm ' + seconds + 's';";
  html += "}";
  
  html += "function scanNetworks() {";
  html += "  const networkList = document.getElementById('network-list');";
  html += "  networkList.innerHTML = '<div class=\\\"loading\\\">Scanning...</div>';";
  html += "  fetch('/api/scan')";
  html += "    .then(response => response.json())";
  html += "    .then(data => {";
  html += "      let html = '';";
  html += "      if (data.networks.length === 0) {";
  html += "        html = '<div class=\\\"no-networks\\\">No networks found</div>';";
  html += "      } else {";
  html += "        html = '<div class=\\\"network-grid\\\">';";
  html += "        data.networks.forEach(network => {";
  html += "          let signalClass = 'weak';";
  html += "          if (network.rssi > -50) signalClass = 'excellent';";
  html += "          else if (network.rssi > -65) signalClass = 'good';";
  html += "          else if (network.rssi > -75) signalClass = 'fair';";
  html += "          html += `<div class=\\\"network-item\\\" onclick=\\\"selectNetwork('${network.ssid}', ${network.secure})\\\">`;";
  html += "          html += `<div class=\\\"network-name\\\">${network.ssid}</div>`;";
  html += "          html += `<div class=\\\"network-info\\\">`;";
  html += "          html += `<div class=\\\"signal ${signalClass}\\\"></div>`;";
  html += "          if (network.secure) html += '<div class=\\\"secure\\\"></div>';";
  html += "          html += `</div></div>`;";
  html += "        });";
  html += "        html += '</div>';";
  html += "      }";
  html += "      networkList.innerHTML = html;";
  html += "    })";
  html += "    .catch(error => {";
  html += "      networkList.innerHTML = '<div class=\\\"error\\\">Error scanning networks</div>';";
  html += "    });";
  html += "}";
  
  html += "function selectNetwork(ssid, secure) {";
  html += "  document.getElementById('ssid').value = ssid;";
  html += "  document.getElementById('password').focus();";
  html += "}";
  
  html += "function connectWifi() {";
  html += "  const ssid = document.getElementById('ssid').value;";
  html += "  const password = document.getElementById('password').value;";
  html += "  if (!ssid) {";
  html += "    alert('Please enter a network name');";
  html += "    return;";
  html += "  }";
  html += "  fetch('/api/connect', {";
  html += "    method: 'POST',";
  html += "    headers: { 'Content-Type': 'application/json' },";
  html += "    body: JSON.stringify({ ssid, password })";
  html += "  })";
  html += "  .then(response => response.json())";
  html += "  .then(data => {";
  html += "    if (data.status === 'connected') {";
  html += "      alert('Connected successfully! Refreshing page...');";
  html += "      setTimeout(() => { location.reload(); }, 1000);";
  html += "    } else {";
  html += "      alert('Connection failed. Please check your credentials.');";
  html += "    }";
  html += "  })";
  html += "  .catch(error => {";
  html += "    alert('Error connecting to WiFi');";
  html += "  });";
  html += "}";
  
  html += "function disconnectWifi() {";
  html += "  if (confirm('Are you sure you want to disconnect from WiFi?')) {";
  html += "    fetch('/api/connect', {";
  html += "      method: 'POST',";
  html += "      headers: { 'Content-Type': 'application/json' },";
  html += "      body: JSON.stringify({ disconnect: true })";
  html += "    })";
  html += "    .then(response => response.json())";
  html += "    .then(data => {";
  html += "      alert('Disconnected from WiFi. Refreshing page...');";
  html += "      setTimeout(() => { location.reload(); }, 1000);";
  html += "    })";
  html += "    .catch(error => {";
  html += "      alert('Error disconnecting from WiFi');";
  html += "    });";
  html += "  }";
  html += "}";
  
  html += "function updateStatus() {";
  html += "  fetch('/api/status')";
  html += "    .then(response => response.json())";
  html += "    .then(data => {";
  html += "      document.getElementById('uptime').textContent = formatUptime(data.uptime);";
  html += "      document.getElementById('cpu-temp').textContent = data.temperature + '°C';";
  html += "    });";
  html += "}";
  
  html += "document.addEventListener('DOMContentLoaded', () => {";
  html += "  scanNetworks();";
  html += "  updateStatus();";
  html += "  uptimeInterval = setInterval(updateStatus, 1000);";
  html += "});";
  html += "</script>";
  
  html += "</body></html>";
  
  server.send(200, "text/html", html);
}

void handleScan() {
  Serial.println("Scanning networks...");
  int numNetworks = WiFi.scanNetworks();
  
  DynamicJsonDocument doc(2048);
  JsonArray networks = doc.createNestedArray("networks");
  
  for (int i = 0; i < numNetworks; i++) {
    JsonObject network = networks.createNestedObject();
    network["ssid"] = WiFi.SSID(i);
    network["rssi"] = WiFi.RSSI(i);
    network["secure"] = WiFi.encryptionType(i) != WIFI_AUTH_OPEN;
    network["channel"] = WiFi.channel(i);
  }
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
  
  WiFi.scanDelete();
}

void handleConnect() {
  if (!server.hasArg("plain")) {
    server.send(400, "application/json", "{\\\"status\\\":\\\"error\\\",\\\"message\\\":\\\"Missing request body\\\"}");
    return;
  }
  
  String body = server.arg("plain");
  DynamicJsonDocument doc(512);
  DeserializationError error = deserializeJson(doc, body);
  
  if (error) {
    server.send(400, "application/json", "{\\\"status\\\":\\\"error\\\",\\\"message\\\":\\\"Invalid JSON\\\"}");
    return;
  }
  
  if (doc.containsKey("disconnect") && doc["disconnect"].as<bool>()) {
    WiFi.disconnect();
    strcpy(config.ssid, "");
    strcpy(config.password, "");
    saveConfig();
    server.send(200, "application/json", "{\\\"status\\\":\\\"disconnected\\\"}");
    return;
  }
  
  if (!doc.containsKey("ssid")) {
    server.send(400, "application/json", "{\\\"status\\\":\\\"error\\\",\\\"message\\\":\\\"Missing SSID\\\"}");
    return;
  }
  
  String ssid = doc["ssid"].as<String>();
  String password = doc.containsKey("password") ? doc["password"].as<String>() : "";
  
  // Save to config
  ssid.toCharArray(config.ssid, 32);
  password.toCharArray(config.password, 64);
  saveConfig();
  
  // Connect to WiFi
  WiFi.begin(ssid.c_str(), password.c_str());
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    deviceIpAddress = WiFi.localIP().toString();
    accessPointMode = false;
    server.send(200, "application/json", "{\\\"status\\\":\\\"connected\\\",\\\"ip\\\":\\\"" + deviceIpAddress + "\\\"}");
  } else {
    server.send(200, "application/json", "{\\\"status\\\":\\\"failed\\\"}");
  }
}

void handleUpdate(HTTPUpload& upload) {
  if (upload.status == UPLOAD_FILE_START) {
    Serial.printf("Update: %s\\n", upload.filename.c_str());
    if (!Update.begin(UPDATE_SIZE_UNKNOWN)) {
      Update.printError(Serial);
    }
  } else if (upload.status == UPLOAD_FILE_WRITE) {
    if (Update.write(upload.buf, upload.currentSize) != upload.currentSize) {
      Update.printError(Serial);
    }
  } else if (upload.status == UPLOAD_FILE_END) {
    if (Update.end(true)) {
      Serial.printf("Update Success: %u bytes\\nRebooting...\\n", upload.totalSize);
    } else {
      Update.printError(Serial);
    }
  }
}

void handleStatus() {
  DynamicJsonDocument doc(256);
  doc["uptime"] = uptime;
  doc["temperature"] = cpuTemperature;
  doc["connected"] = WiFi.status() == WL_CONNECTED;
  doc["accessPoint"] = accessPointMode;
  doc["ip"] = deviceIpAddress;
  doc["mac"] = deviceMacAddress;
  
  if (WiFi.status() == WL_CONNECTED) {
    doc["ssid"] = WiFi.SSID();
    doc["rssi"] = WiFi.RSSI();
  }
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

void handleTheme() {
  String theme;
  
  if (portalTheme == "light") {
    theme = "* { box-sizing: border-box; margin: 0; padding: 0; }";
    theme += "body { font-family: Arial, sans-serif; background-color: #f1f5f9; color: #0f172a; line-height: 1.6; }";
    theme += ".container { max-width: 600px; margin: 0 auto; padding: 20px; }";
    theme += "h1, h2 { margin-bottom: 20px; color: #0f172a; }";
    theme += "h1 { text-align: center; }";
    theme += ".card { background: #fff; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }";
    // ... add more light theme CSS
  } 
  else if (portalTheme == "teal") {
    theme = "* { box-sizing: border-box; margin: 0; padding: 0; }";
    theme += "body { font-family: Arial, sans-serif; background-color: #0d1b2a; color: #e0e0e0; line-height: 1.6; }";
    theme += ".container { max-width: 600px; margin: 0 auto; padding: 20px; }";
    theme += "h1, h2 { margin-bottom: 20px; color: #0d9488; }"; 
    theme += "h1 { text-align: center; }";
    theme += ".card { background: #1e2a3a; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }";
    // ... add more teal theme CSS
  }
  else {  // dark theme
    theme = "* { box-sizing: border-box; margin: 0; padding: 0; }";
    theme += "body { font-family: Arial, sans-serif; background-color: #0f172a; color: #e0e0e0; line-height: 1.6; }";
    theme += ".container { max-width: 600px; margin: 0 auto; padding: 20px; }";
    theme += "h1, h2 { margin-bottom: 20px; color: #60a5fa; }";
    theme += "h1 { text-align: center; }";
    theme += ".card { background: #1e293b; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }";
    // ... add more dark theme CSS
  }
  
  // Common styles
  theme += ".form-group { margin-bottom: 15px; }";
  theme += "label { display: block; margin-bottom: 5px; font-weight: bold; }";
  theme += "input[type='text'], input[type='password'] { width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #333; background-color: rgba(255,255,255,0.1); color: inherit; }";
  theme += ".button { padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: all 0.3s; }";
  theme += ".primary { background-color: #3b82f6; color: white; }";
  theme += ".primary:hover { background-color: #2563eb; }";
  theme += ".secondary { background-color: #6b7280; color: white; }";
  theme += ".secondary:hover { background-color: #4b5563; }";
  theme += ".danger { background-color: #ef4444; color: white; }";
  theme += ".danger:hover { background-color: #dc2626; }";
  
  server.send(200, "text/css", theme);
}

bool loadConfig() {
  if (!SPIFFS.exists(CONFIG_FILE)) {
    return false;
  }
  
  File configFile = SPIFFS.open(CONFIG_FILE, "r");
  if (!configFile) {
    return false;
  }
  
  size_t size = configFile.size();
  if (size > 1024) {
    configFile.close();
    return false;
  }
  
  std::unique_ptr<char[]> buf(new char[size]);
  configFile.readBytes(buf.get(), size);
  configFile.close();
  
  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, buf.get());
  if (error) {
    return false;
  }
  
  strlcpy(config.ssid, doc["ssid"] | "", sizeof(config.ssid));
  strlcpy(config.password, doc["password"] | "", sizeof(config.password));
  config.enableCaptivePortal = doc["enableCaptivePortal"] | true;
  strlcpy(config.portalName, doc["portalName"] | "Embediverse Portal", sizeof(config.portalName));
  strlcpy(config.portalTheme, doc["portalTheme"] | "dark", sizeof(config.portalTheme));
  
  return true;
}

void saveConfig() {
  DynamicJsonDocument doc(1024);
  
  doc["ssid"] = config.ssid;
  doc["password"] = config.password;
  doc["enableCaptivePortal"] = config.enableCaptivePortal;
  doc["portalName"] = config.portalName;
  doc["portalTheme"] = config.portalTheme;
  
  File configFile = SPIFFS.open(CONFIG_FILE, "w");
  if (!configFile) {
    Serial.println("Failed to open config file for writing");
    return;
  }
  
  serializeJson(doc, configFile);
  configFile.close();
}

String getMAC() {
  uint8_t mac[6];
  WiFi.macAddress(mac);
  char macStr[18] = { 0 };
  sprintf(macStr, "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
  return String(macStr);
}

float getCpuTemperature() {
  // ESP32 has a built-in temperature sensor
  #ifdef ESP32
    return temperatureRead();
  #else
    return 0;  // Not available on non-ESP32 boards
  #endif
}

void startCaptivePortal() {
  String apName = "Embediverse-" + String(ESP.getChipId(), HEX);
  
  Serial.println("Starting access point: " + apName);
  WiFi.mode(WIFI_AP);
  WiFi.softAP(apName.c_str(), AP_PASSWORD);
  
  Serial.print("AP IP address: ");
  deviceIpAddress = WiFi.softAPIP().toString();
  Serial.println(deviceIpAddress);
  
  // Start DNS server for captive portal if enabled
  if (captivePortalEnabled) {
    dnsServer.start(DNS_PORT, "*", WiFi.softAPIP());
    Serial.println("DNS server started");
  }
  
  accessPointMode = true;
}
`;

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
