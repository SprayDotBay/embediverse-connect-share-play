import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileJson, Server, Wifi, Code, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const codeExamples = {
  setup: `#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);
// Create a WebSocket object
AsyncWebSocket ws("/ws");

// WiFi credentials
const char* ssid = "YourSSID";
const char* password = "YourPassword";

void setup() {
  Serial.begin(115200);
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  // Print ESP32 Local IP Address
  Serial.println(WiFi.localIP());
  
  // Route for root / web page
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/html", "ESP32 Async Web Server");
  });
  
  // Route to get sensor data in JSON format
  server.on("/sensorData", HTTP_GET, [](AsyncWebServerRequest *request){
    DynamicJsonDocument doc(1024);
    doc["temperature"] = readTemperature();
    doc["humidity"] = readHumidity();
    doc["pressure"] = readPressure();
    doc["moisture"] = readMoisture();
    
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
  });
  
  // Add WebSocket handler
  ws.onEvent(onWebSocketEvent);
  server.addHandler(&ws);
  
  // Start server
  server.begin();
}`,
  websocket: `// WebSocket Event Handler
void onWebSocketEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, 
                     AwsEventType type, void *arg, uint8_t *data, size_t len) {
  switch (type) {
    case WS_EVT_CONNECT:
      Serial.printf("WebSocket client #%u connected from %s\\n", client->id(), client->remoteIP().toString().c_str());
      // Send initial data when client connects
      sendSensorDataViaWebSocket(client);
      break;
    case WS_EVT_DISCONNECT:
      Serial.printf("WebSocket client #%u disconnected\\n", client->id());
      break;
    case WS_EVT_DATA:
      handleWebSocketMessage(arg, data, len);
      break;
    case WS_EVT_PONG:
    case WS_EVT_ERROR:
      break;
  }
}

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len) {
  AwsFrameInfo *info = (AwsFrameInfo*)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
    // Null-terminate the received data
    data[len] = 0;
    
    // Parse JSON command
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, (char*)data);
    
    if (!error) {
      // Process the received command
      if (doc.containsKey("command")) {
        String command = doc["command"];
        if (command == "getSensorData") {
          sendSensorDataToAllClients();
        }
      }
    }
  }
}`,
  sensorLoop: `// Store sensor readings
float temperature = 0;
float humidity = 0;
float pressure = 0;
float moisture = 0;

void loop() {
  static unsigned long lastReadTime = 0;
  static unsigned long lastWebSocketUpdate = 0;
  
  // Read sensors every 5 seconds
  if (millis() - lastReadTime > 5000) {
    temperature = readTemperature();
    humidity = readHumidity();
    pressure = readPressure();
    moisture = readMoisture();
    lastReadTime = millis();
    
    // Debug print
    Serial.printf("Temperature: %.1f°C, Humidity: %.1f%%, Pressure: %.2f hPa, Moisture: %.1f%%\\n",
                  temperature, humidity, pressure, moisture);
  }
  
  // Send WebSocket updates every 1 second
  if (millis() - lastWebSocketUpdate > 1000) {
    sendSensorDataToAllClients();
    lastWebSocketUpdate = millis();
  }

  // Implement your main program logic here
}

// Send current sensor values to all connected WebSocket clients
void sendSensorDataToAllClients() {
  DynamicJsonDocument doc(1024);
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["pressure"] = pressure; 
  doc["moisture"] = moisture;
  doc["timestamp"] = millis();
  
  String jsonString;
  serializeJson(doc, jsonString);
  ws.textAll(jsonString);
}`,
  html: `<!DOCTYPE html>
<html>
<head>
  <title>ESP32 Sensor Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f8f9fa;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .chart-container {
      height: 300px;
      margin-bottom: 20px;
    }
    .readings {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .card {
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    .temperature { background-color: #ffebee; }
    .humidity { background-color: #e3f2fd; }
    .pressure { background-color: #e8f5e9; }
    .moisture { background-color: #ede7f6; }
    h1 { text-align: center; }
    .value { font-size: 24px; font-weight: bold; }
    .label { font-size: 14px; color: #666; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div class="container">
    <h1>ESP32 Sensor Dashboard</h1>
    
    <div class="readings">
      <div class="card temperature">
        <div class="label">Temperature</div>
        <div class="value" id="temperature">--°C</div>
      </div>
      <div class="card humidity">
        <div class="label">Humidity</div>
        <div class="value" id="humidity">--%</div>
      </div>
      <div class="card pressure">
        <div class="label">Pressure</div>
        <div class="value" id="pressure">-- hPa</div>
      </div>
      <div class="card moisture">
        <div class="label">Moisture</div>
        <div class="value" id="moisture">--%</div>
      </div>
    </div>
    
    <div class="chart-container">
      <canvas id="sensorChart"></canvas>
    </div>
  </div>

  <script>
    // Setup the chart
    const ctx = document.getElementById('sensorChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          { label: 'Temperature (°C)', data: [], borderColor: '#f44336', tension: 0.4 },
          { label: 'Humidity (%)', data: [], borderColor: '#2196f3', tension: 0.4 },
          { label: 'Moisture (%)', data: [], borderColor: '#9c27b0', tension: 0.4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
    
    // Maximum number of data points to show
    const MAX_DATA_POINTS = 20;
    
    // Connect to WebSocket server
    const ws = new WebSocket('ws://' + window.location.hostname + '/ws');
    
    ws.onopen = function() {
      console.log('Connected to WebSocket server');
      // Request initial data
      ws.send(JSON.stringify({command: 'getSensorData'}));
    };
    
    ws.onmessage = function(event) {
      const data = JSON.parse(event.data);
      
      // Update displayed values
      document.getElementById('temperature').textContent = data.temperature.toFixed(1) + '°C';
      document.getElementById('humidity').textContent = data.humidity.toFixed(1) + '%';
      document.getElementById('pressure').textContent = data.pressure.toFixed(2) + ' hPa';
      document.getElementById('moisture').textContent = data.moisture.toFixed(1) + '%';
      
      // Add timestamp label
      const now = new Date();
      const timeLabel = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0') + ':' + 
                       now.getSeconds().toString().padStart(2, '0');
      
      chart.data.labels.push(timeLabel);
      chart.data.datasets[0].data.push(data.temperature);
      chart.data.datasets[1].data.push(data.humidity);
      chart.data.datasets[2].data.push(data.moisture);
      
      // Remove old data points to keep chart size manageable
      if (chart.data.labels.length > MAX_DATA_POINTS) {
        chart.data.labels.shift();
        chart.data.datasets.forEach(dataset => dataset.data.shift());
      }
      
      chart.update();
    };
    
    ws.onclose = function() {
      console.log('Disconnected from WebSocket server');
      // Try to reconnect after 5 seconds
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        location.reload();
      }, 5000);
    };
    
    ws.onerror = function(error) {
      console.log('WebSocket error:', error);
    };
  </script>
</body>
</html>`
};

export const ESPAsyncWebServerGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            ESP32 Async Web Server Implementation Guide
          </CardTitle>
          <CardDescription>
            A comprehensive guide to implementing a real-time sensor dashboard using ESP32 with Async Web Server and WebSockets
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Configurable WiFi with network scanner</li>
                  <li>WebSocket communication for real-time updates</li>
                  <li>RESTful API endpoints for sensor data</li>
                  <li>Time synchronization with NTP</li>
                  <li>Remote firmware updates (OTA)</li>
                  <li>Secure user interface with protected endpoints</li>
                  <li>Real-time sensor data visualization</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Required Libraries</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li><span className="font-mono text-sm">ESPAsyncWebServer</span> - Async HTTP and WebSocket server</li>
                  <li><span className="font-mono text-sm">AsyncTCP</span> - Asynchronous TCP library for ESP32</li>
                  <li><span className="font-mono text-sm">ArduinoJson</span> - JSON processing</li>
                  <li><span className="font-mono text-sm">DHT sensor library</span> - For temperature/humidity</li>
                  <li><span className="font-mono text-sm">Adafruit BMP280</span> - For pressure/altitude</li>
                  <li><span className="font-mono text-sm">SPIFFS</span> - File system for web files</li>
                </ul>
              </div>
            </div>
            
            <Separator />
            
            <Tabs defaultValue="setup">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="setup" className="flex items-center gap-1">
                  <Settings className="h-4 w-4" /> Basic Setup
                </TabsTrigger>
                <TabsTrigger value="websocket" className="flex items-center gap-1">
                  <Wifi className="h-4 w-4" /> WebSocket Events
                </TabsTrigger>
                <TabsTrigger value="sensor" className="flex items-center gap-1">
                  <Code className="h-4 w-4" /> Sensor Loop
                </TabsTrigger>
                <TabsTrigger value="frontend" className="flex items-center gap-1">
                  <FileJson className="h-4 w-4" /> HTML Dashboard
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="setup">
                <h3 className="text-lg font-medium mb-2">Initial Setup & Configuration</h3>
                <p className="text-muted-foreground mb-4">
                  This code initializes the ESP32 with AsyncWebServer, sets up WiFi connection, 
                  and configures endpoints for the web interface and API.
                </p>
                <Card className="overflow-hidden">
                  <ScrollArea className="h-96">
                    <pre className="p-4 text-xs">
                      <code>{codeExamples.setup}</code>
                    </pre>
                  </ScrollArea>
                </Card>
              </TabsContent>
              
              <TabsContent value="websocket">
                <h3 className="text-lg font-medium mb-2">WebSocket Event Handling</h3>
                <p className="text-muted-foreground mb-4">
                  Implementation of WebSocket events to handle client connections and messages
                  for real-time communication with the dashboard.
                </p>
                <Card className="overflow-hidden">
                  <ScrollArea className="h-96">
                    <pre className="p-4 text-xs">
                      <code>{codeExamples.websocket}</code>
                    </pre>
                  </ScrollArea>
                </Card>
              </TabsContent>
              
              <TabsContent value="sensor">
                <h3 className="text-lg font-medium mb-2">Sensor Reading Loop</h3>
                <p className="text-muted-foreground mb-4">
                  Main loop implementation for reading sensor data and broadcasting to WebSocket clients.
                </p>
                <Card className="overflow-hidden">
                  <ScrollArea className="h-96">
                    <pre className="p-4 text-xs">
                      <code>{codeExamples.sensorLoop}</code>
                    </pre>
                  </ScrollArea>
                </Card>
              </TabsContent>
              
              <TabsContent value="frontend">
                <h3 className="text-lg font-medium mb-2">HTML Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Responsive HTML dashboard with real-time charts using Chart.js and WebSocket connection.
                </p>
                <Card className="overflow-hidden">
                  <ScrollArea className="h-96">
                    <pre className="p-4 text-xs">
                      <code>{codeExamples.html}</code>
                    </pre>
                  </ScrollArea>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Implementation Steps</h3>
              <ol className="list-decimal pl-5 space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Set up your development environment</strong>
                  <p>Install Arduino IDE or PlatformIO in VS Code, then install ESP32 board support and required libraries.</p>
                </li>
                <li>
                  <strong className="text-foreground">Create your HTML dashboard files</strong>
                  <p>Create an HTML file with CSS and JavaScript for your dashboard and save it to the data folder.</p>
                </li>
                <li>
                  <strong className="text-foreground">Upload SPIFFS data</strong>
                  <p>Use the "ESP32 Sketch Data Upload" tool to upload your web files to the ESP32's flash memory.</p>
                </li>
                <li>
                  <strong className="text-foreground">Connect your sensors</strong>
                  <p>Wire your DHT-11 and BMP-280 sensors to the ESP32 according to their pinouts.</p>
                </li>
                <li>
                  <strong className="text-foreground">Upload firmware code</strong>
                  <p>Upload the Arduino code to your ESP32 and monitor the serial output for debugging.</p>
                </li>
                <li>
                  <strong className="text-foreground">Access the dashboard</strong>
                  <p>Connect to the ESP32's IP address in a web browser to view your sensor dashboard.</p>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
