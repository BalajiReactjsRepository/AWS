/* eslint-disable no-loop-func */
// Meaningful colors for each sensor

const SENSOR_COLORS = {
  Humidity: "#457B9D", // Blue (Water)
  "Atmospheric Pressure": "#E9C46A", // Yellow (Pressure)
  "Wind Direction": "#2A9D8F", // Green (Wind)
  "Wind Speed": "#1F77B4", // Light Blue (Motion)
  "Air Temperature": "#E63946", // Red (Heat)
  "Daily Rain": "#A8DADC", // Soft Blue (Rain)
  "Hourly Rainfall": "#457B9D", // Grouped with Humidity
  "Hourly Rain": "#264653", // Dark Teal (Heavy Rain)
  "Battery Voltage": "#F4A261", // Orange (Power)
  Evap: "#2E86AB", // Deep Aqua Blue (Evaporation)
  "Solar Radiation": "#FDB813", // Sun Yellow (Radiation)
};

// Function to generate a random color (ensuring a broader range of visible colors)
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF"; // Wider color range
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};

// Get color for a given sensor
export const getSensorColor = (sensorName) => {
  if (!SENSOR_COLORS[sensorName]) {
    // If color doesn't exist, create one
    SENSOR_COLORS[sensorName] = generateRandomColor();
  }
  return SENSOR_COLORS[sensorName];
};
