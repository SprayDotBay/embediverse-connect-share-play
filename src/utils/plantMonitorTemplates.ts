
export const canGrowEsp32Template = `
// CanGrow ESP32 Firmware
// Taimede jälgimise ja juhtimise püsivara ESP32 mikrokontrolleritele

#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include "XT_DAC_Audio.h"

// Põhikonfiguratsioon
const char* ssid = "CanGrowWiFi";
const char* password = "taimesober";
bool apMode = false;

// Serverid
AsyncWebServer server(80);

// Sensorite seaded
#define DHTPIN 13      // DHT andur on ühendatud GPIO13 külge
#define DHTTYPE DHT22  // DHT 22 tüüp
#define SOIL_MOISTURE_PIN 34  // Mullaniiskuse andur on ühendatud GPIO34 (ADC) külge
#define LIGHT_SENSOR_PIN 35   // Valgusandur on ühendatud GPIO35 (ADC) külge

// Väljundite seaded
#define LED_PIN 16    // LED on ühendatud GPIO16 külge
#define PUMP_PIN 17   // Pump on ühendatud GPIO17 külge
#define FAN1_PIN 18   // Ventilaator 1 on ühendatud GPIO18 külge
#define FAN2_PIN 19   // Ventilaator 2 on ühendatud GPIO19 külge
#define SPEAKER_PIN 25 // Kõlar on ühendatud GPIO25 külge

// LCD ekraani ühendamine - kasutatakse I2C liidest
LiquidCrystal_I2C lcd(0x27, 16, 2);  // Määra LCD aadress 0x27, 16 veergu ja 2 rida

// Sensorid
DHT dht(DHTPIN, DHTTYPE);

// Helifail linnulaulu jaoks
const unsigned char bird_sound[] PROGMEM = {
  // Siia tuleb linnulaulu helifaili andmed
};

// Muutujad sensorite näitude jaoks
float temperature = 0;
float humidity = 0;
int soilMoisture = 0;
int lightLevel = 0;
bool ledState = false;
bool pumpState = false;
bool fan1State = false;
bool fan2State = false;

// Kasvuseaded
String growName = "CanGrow Taimed";
String startDate = "2025-05-01";
int vegetationDays = 45;
int bloomDays = 60;
int maintenanceDuration = 120;
int lightIntensity = 50;

// Audio muutujad
XT_DAC_Audio_Class DacAudio(SPEAKER_PIN, 0);
XT_Wav_Class BirdSound(bird_sound);
bool isPlayingSound = false;

void setup() {
  // Alusta jadapordi sidet
  Serial.begin(115200);
  
  // Initsialiseeri SPIFFS failisüsteem
  if (!SPIFFS.begin(true)) {
    Serial.println("SPIFFS initsialiseerimine ebaõnnestus!");
    return;
  }
  
  // Seadista väljundid
  pinMode(LED_PIN, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(FAN1_PIN, OUTPUT);
  pinMode(FAN2_PIN, OUTPUT);
  
  // Alusta DHT sensorit
  dht.begin();
  
  // Alusta LCD ekraani
  Wire.begin();
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("CanGrow v2.0");
  lcd.setCursor(0, 1);
  lcd.print("Alustamine...");

  // Ühenda WiFi-ga
  WiFi.begin(ssid, password);
  for (int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++) {
    delay(1000);
    Serial.println("Ühendun WiFi-ga...");
  }
  
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi ühendus ebaõnnestus. Alustan Access Point režiimis.");
    apMode = true;
    WiFi.softAP(ssid, password);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("AP Mode: CanGrow");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.softAPIP().toString());
  } else {
    Serial.println("WiFi ühendatud!");
    Serial.print("IP aadress: ");
    Serial.println(WiFi.localIP());
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("CanGrow online!");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP().toString());
  }

  // API marsruudid
  server.on("/api/sensors", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<512> doc;
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["soilMoisture"] = soilMoisture;
    doc["lightLevel"] = lightLevel;
    doc["ledState"] = ledState;
    doc["pumpState"] = pumpState;
    doc["fan1State"] = fan1State;
    doc["fan2State"] = fan2State;
    
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
  });

  server.on("/api/control", HTTP_POST, [](AsyncWebServerRequest *request) {
    request->send(200, "text/plain", "Käsk vastu võetud");
  }, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
    StaticJsonDocument<512> doc;
    deserializeJson(doc, data, len);
    
    if (doc.containsKey("command")) {
      String command = doc["command"];
      
      if (command == "light") {
        ledState = doc["value"].as<bool>();
        digitalWrite(LED_PIN, ledState ? HIGH : LOW);
      }
      else if (command == "lightIntensity") {
        lightIntensity = doc["value"].as<int>();
        // PWM väärtus 0-255
        int pwmValue = map(lightIntensity, 0, 100, 0, 255);
        analogWrite(LED_PIN, pwmValue);
      }
      else if (command == "pump") {
        pumpState = doc["value"].as<bool>();
        digitalWrite(PUMP_PIN, pumpState ? HIGH : LOW);
      }
      else if (command == "fan1") {
        fan1State = doc["value"].as<bool>();
        digitalWrite(FAN1_PIN, fan1State ? HIGH : LOW);
      }
      else if (command == "fan2") {
        fan2State = doc["value"].as<bool>();
        digitalWrite(FAN2_PIN, fan2State ? HIGH : LOW);
      }
      else if (command == "playBirdSounds") {
        isPlayingSound = true;
      }
      else if (command == "setGrowSettings") {
        growName = doc["growName"].as<String>();
        startDate = doc["startDate"].as<String>();
        vegetationDays = doc["vegetationDays"].as<int>();
        bloomDays = doc["bloomDays"].as<int>();
        maintenanceDuration = doc["maintenanceDuration"].as<int>();
      }
    }
  });

  // Staatilised failid
  server.serveStatic("/", SPIFFS, "/").setDefaultFile("index.html");
  
  // Käivita server
  server.begin();
  Serial.println("HTTP server käivitatud");
}

void loop() {
  // Loe andmeid sensoritelt
  updateSensors();
  
  // Uuenda LCD ekraani
  updateLcd();
  
  // Linnulaul kui vajalik
  if (isPlayingSound) {
    DacAudio.FillBuffer();
    if (BirdSound.Playing == false) {
      BirdSound.RepeatForever = false;
      DacAudio.Play(&BirdSound);
    }
    // Peata pärast 30 sekundit
    static unsigned long soundStartTime = millis();
    if (millis() - soundStartTime > 30000) {
      BirdSound.Stop();
      isPlayingSound = false;
      soundStartTime = millis();
    }
  }
  
  delay(1000);  // Väike viivitus, et mitte CPU-d liiga palju koormata
}

void updateSensors() {
  // DHT sensorilt temperatuuri ja niiskuse lugemine
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();
  
  // Kontrolli, kas lugemine õnnestus
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("DHT lugemisel viga!");
    // Kasuta varuväärtusi, et mitte kogu süsteemi peatada
    humidity = 50.0;
    temperature = 22.0;
  }
  
  // Loe mullaniiskust
  int rawSoilMoisture = analogRead(SOIL_MOISTURE_PIN);
  // Teisenda 0-100 skaalale (sõltuvalt sensori tüübist võib see valem erineda)
  soilMoisture = map(rawSoilMoisture, 4095, 1000, 0, 100);
  soilMoisture = constrain(soilMoisture, 0, 100);
  
  // Loe valguse taset
  int rawLightLevel = analogRead(LIGHT_SENSOR_PIN);
  // Teisenda 0-1000 skaalale (sõltuvalt sensori tüübist võib see valem erineda)
  lightLevel = map(rawLightLevel, 4095, 0, 0, 1000);
  
  // Saada info jadaporti
  Serial.print("Temperatuur: ");
  Serial.print(temperature);
  Serial.print(" °C | Õhuniiskus: ");
  Serial.print(humidity);
  Serial.print(" % | Mullaniiskus: ");
  Serial.print(soilMoisture);
  Serial.print(" % | Valgustase: ");
  Serial.print(lightLevel);
  Serial.println(" lux");
}

void updateLcd() {
  // Static muutuja kontrollimaks, et LCD ekraani ei uuendataks iga tsükli ajal
  static unsigned long lastLcdUpdate = 0;
  
  // Uuenda LCD ekraani iga 2 sekundi järel
  if (millis() - lastLcdUpdate > 2000) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("T:");
    lcd.print(temperature, 1);
    lcd.print("C H:");
    lcd.print(humidity, 0);
    lcd.print("%");
    
    lcd.setCursor(0, 1);
    lcd.print("Muld:");
    lcd.print(soilMoisture);
    lcd.print("% L:");
    lcd.print(lightLevel/10);
    lcd.print("%");
    
    lastLcdUpdate = millis();
  }
}
`;

export const esp32WifiSetupGuide = `
# ESP32 PlatformIO seadistamise juhend

## Vajalikud komponendid:
1. ESP32 mikrokontroller
2. USB kaabel 
3. DHT22 temperatuuri ja niiskuse andur
4. Maketeerimislaud ja juhtmed
5. Mullaniiskuse andur
6. 16x2 LCD ekraan (I2C)
7. LED valgustus, pump ja ventilaatorid
8. Kõlar (ühendatakse GPIO25 kaudu)

## Sammud seadistamiseks:

### 1. PlatformIO paigaldamine
1. Paigalda Visual Studio Code
2. Lisa PlatformIO laiendus VS Code-ile
3. Ava PlatformIO Home ja loo uus projekt

### 2. Projekti loomine PlatformIO-s
1. Klõpsa "New Project"
2. Anna projektile nimi (nt "CanGrow")
3. Vali plaadiks "ESP32 Dev Module"
4. Vali raamistikuks "Arduino"

### 3. Vajalikud teegid
Lisa järgmised teegid projekti platformio.ini faili:
\`\`\`
lib_deps =
  ottowinter/ESPAsyncWebServer-esphome
  bblanchon/ArduinoJson
  adafruit/DHT sensor library
  adafruit/Adafruit Unified Sensor
  marcoschwartz/LiquidCrystal_I2C
  xviluxa/XT_DAC_Audio
\`\`\`

### 4. Riistvara ühendamine:

#### LCD ekraan (I2C):
- VCC -> 5V
- GND -> GND
- SDA -> GPIO21
- SCL -> GPIO22

#### DHT22 andur:
- VCC -> 3.3V
- DATA -> GPIO13
- GND -> GND

#### Mullaniiskuse andur:
- VCC -> 3.3V
- GND -> GND
- SIGNAL -> GPIO34

#### Valgusandur:
- VCC -> 3.3V
- GND -> GND
- SIGNAL -> GPIO35

#### LED valgustus:
- VCC -> 5V
- GND läbi transistori
- SIGNAL -> GPIO16

#### Pump:
- VCC -> 5V
- GND läbi transistori või relee
- SIGNAL -> GPIO17

#### Ventilaatorid:
- FAN1 SIGNAL -> GPIO18
- FAN2 SIGNAL -> GPIO19

#### Kõlar:
- POSITIVE -> GPIO25
- NEGATIVE -> GND

### 5. Koodi üles laadimine
1. Kopeeri kood oma main.cpp faili
2. Klõpsa PlatformIO all "Build" ja siis "Upload"
3. Jälgi edukat kompileerimist ja üleslaadimsit

### 6. Ühendamine ja kasutamine
1. Ühenda oma arvuti/telefon ESP32 poolt loodud WiFi võrku
   - Võrgunimi: CanGrowWiFi
   - Parool: taimesober
2. Ava veebibrauser ja mine aadressile http://192.168.4.1
3. Kasuta veebiliidest taimede jälgimiseks ja juhtimiseks
\`\`\`
`;
