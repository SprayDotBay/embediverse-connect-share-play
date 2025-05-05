
// Utility functions for generating mock data for charts

// Generate time series data for real-time charts
export const generateTimeSeriesData = (count: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    data.push({
      time: `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`,
      temperature: 22 + Math.sin(i / 3) * 5 + Math.random() * 2,
      humidity: 40 + Math.cos(i / 5) * 15 + Math.random() * 5,
      pressure: 1013 + Math.sin(i / 8) * 10 + Math.random() * 3,
    });
  }
  
  return data;
};

// Historical data for the past year
export const historicalData = [
  { month: 'Jan', temperature: 18.2, humidity: 45, pressure: 1012 },
  { month: 'Feb', temperature: 19.5, humidity: 50, pressure: 1010 },
  { month: 'Mar', temperature: 21.3, humidity: 55, pressure: 1008 },
  { month: 'Apr', temperature: 24.7, humidity: 60, pressure: 1006 },
  { month: 'May', temperature: 27.1, humidity: 65, pressure: 1005 },
  { month: 'Jun', temperature: 29.3, humidity: 72, pressure: 1004 },
  { month: 'Jul', temperature: 30.5, humidity: 78, pressure: 1003 },
  { month: 'Aug', temperature: 30.2, humidity: 76, pressure: 1004 },
  { month: 'Sep', temperature: 28.3, humidity: 70, pressure: 1006 },
  { month: 'Oct', temperature: 25.6, humidity: 65, pressure: 1008 },
  { month: 'Nov', temperature: 22.1, humidity: 55, pressure: 1010 },
  { month: 'Dec', temperature: 19.4, humidity: 47, pressure: 1012 },
];

// Sensor status data for dashboard cards
export const sensorStatusData = [
  { id: 1, name: "Temperature", value: 23.5, unit: "°C", status: "normal", min: 10, max: 35 },
  { id: 2, name: "Humidity", value: 45.2, unit: "%", status: "normal", min: 30, max: 80 },
  { id: 3, name: "Pressure", value: 1013.5, unit: "hPa", status: "normal", min: 990, max: 1030 },
  { id: 4, name: "Light", value: 650, unit: "lux", status: "high", min: 0, max: 500 },
  { id: 5, name: "CO2", value: 412, unit: "ppm", status: "normal", min: 300, max: 1200 },
  { id: 6, name: "Battery", value: 72, unit: "%", status: "normal", min: 20, max: 100 },
];
