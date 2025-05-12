// ESPUI Template for ESP32/ESP8266

export const espuiTemplate = `
// Simple ESPUI Example with DHT11 and BMP280 sensors
// This creates a web interface to monitor sensor data

#include <Arduino.h>
#include <ESPUI.h>

#if defined(ESP32)
  #include <WiFi.h>
  #include <AsyncTCP.h>
#else
  #include <ESP8266WiFi.h>
  #include <ESPAsyncTCP.h>
#endif

#include <DNSServer.h>
#include <ESPAsyncWebServer.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>
#include <DHT.h>

// Wifi Credentials
const char* ssid = "YourSSID";
const char* password = "YourPassword";

// Sensor configurations
#define DHTPIN 4         // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11    // DHT 11
DHT dht(DHTPIN, DHTTYPE);

Adafruit_BMP280 bmp; // Use I2C interface

// UI Control IDs
uint16_t tempLabel;
uint16_t humidLabel;
uint16_t pressLabel;
uint16_t altLabel;
uint16_t tempGraph;
uint16_t humidGraph;

uint16_t statusLabel;

// Variables for periodic reading and graphing
unsigned long lastDHTRead = 0;
const long dhtInterval = 2000;  // Read DHT every 2 seconds

unsigned long lastBMPRead = 0;
const long bmpInterval = 1000;  // Read BMP every 1 second

unsigned long lastGraphUpdate = 0;
const long graphInterval = 5000; // Update graphs every 5 seconds

float temperature = 0;
float humidity = 0;
float pressure = 0;
float altitude = 0;

// Function declarations
void setupSensors();
void readDHTSensor();
void readBMPSensor();
void updateGraphs();

void setup() {
  Serial.begin(115200);
  delay(100);
  
  // Initialize sensors
  setupSensors();
  
  // Start WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());

  // Setup UI
  ESPUI.setVerbosity(Verbosity::VerboseJSON);
  
  // Status Tab
  statusLabel = ESPUI.addControl(ControlType::Label, "Status", "System Online", ControlColor::Emerald);
  
  // Create sensor display elements
  tempLabel = ESPUI.addControl(ControlType::Label, "Temperature", "-- °C", ControlColor::Carrot);
  humidLabel = ESPUI.addControl(ControlType::Label, "Humidity", "-- %", ControlColor::Alizarin);
  pressLabel = ESPUI.addControl(ControlType::Label, "Pressure", "-- hPa", ControlColor::Peterriver);
  altLabel = ESPUI.addControl(ControlType::Label, "Altitude", "-- m", ControlColor::Wetasphalt);
  
  // Create graphs
  tempGraph = ESPUI.addControl(ControlType::Graph, "Temperature Graph", "", ControlColor::Carrot);
  ESPUI.addGraphPoint(tempGraph, 0);
  
  humidGraph = ESPUI.addControl(ControlType::Graph, "Humidity Graph", "", ControlColor::Alizarin);
  ESPUI.addGraphPoint(humidGraph, 0);
  
  // Start the UI
  ESPUI.begin("Sensor Dashboard");
}

void loop() {
  unsigned long currentMillis = millis();
  
  // Read DHT sensor
  if (currentMillis - lastDHTRead >= dhtInterval) {
    lastDHTRead = currentMillis;
    readDHTSensor();
  }
  
  // Read BMP sensor
  if (currentMillis - lastBMPRead >= bmpInterval) {
    lastBMPRead = currentMillis;
    readBMPSensor();
  }
  
  // Update graphs
  if (currentMillis - lastGraphUpdate >= graphInterval) {
    lastGraphUpdate = currentMillis;
    updateGraphs();
  }
}

void setupSensors() {
  // Initialize DHT sensor
  dht.begin();
  
  // Initialize BMP280 sensor
  if (!bmp.begin(0x76)) {  // Try 0x77 if 0x76 doesn't work
    Serial.println("Could not find a valid BMP280 sensor, check wiring!");
  } else {
    /* Default settings from datasheet. */
    bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,    /* Operating Mode. */
                   Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                   Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                   Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                   Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */
  }
}

void readDHTSensor() {
  // Reading temperature or humidity takes about 250 milliseconds!
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();
  
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    ESPUI.print(statusLabel, "DHT Sensor Error");
    return;
  }
  
  // Update UI Labels
  char tempStr[10];
  sprintf(tempStr, "%.1f °C", temperature);
  ESPUI.print(tempLabel, tempStr);
  
  char humStr[10];
  sprintf(humStr, "%.1f %%", humidity);
  ESPUI.print(humidLabel, humStr);
  
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print(" °C, Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");
}

void readBMPSensor() {
  pressure = bmp.readPressure() / 100.0F; // Convert Pa to hPa
  altitude = bmp.readAltitude(1013.25); // Standard pressure level
  
  // Update UI Labels
  char pressStr[15];
  sprintf(pressStr, "%.2f hPa", pressure);
  ESPUI.print(pressLabel, pressStr);
  
  char altStr[10];
  sprintf(altStr, "%.1f m", altitude);
  ESPUI.print(altLabel, altStr);
  
  Serial.print("Pressure: ");
  Serial.print(pressure);
  Serial.print(" hPa, Altitude: ");
  Serial.print(altitude);
  Serial.println(" m");
}

void updateGraphs() {
  // Add data points to graphs
  ESPUI.addGraphPoint(tempGraph, temperature);
  ESPUI.addGraphPoint(humidGraph, humidity);
  
  // Limit data points (keep last 50)
  if (ESPUI.getGraphLength(tempGraph) > 50) {
    ESPUI.resetGraph(tempGraph);
    for (int i = ESPUI.getGraphLength(tempGraph) - 50; i < ESPUI.getGraphLength(tempGraph); i++) {
      ESPUI.addGraphPoint(tempGraph, ESPUI.getGraphValue(tempGraph, i));
    }
  }
  
  if (ESPUI.getGraphLength(humidGraph) > 50) {
    ESPUI.resetGraph(humidGraph);
    for (int i = ESPUI.getGraphLength(humidGraph) - 50; i < ESPUI.getGraphLength(humidGraph); i++) {
      ESPUI.addGraphPoint(humidGraph, ESPUI.getGraphValue(humidGraph, i));
    }
  }
}
`;
