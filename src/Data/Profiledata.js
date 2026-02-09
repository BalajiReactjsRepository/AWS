const performedBys = [
  "Rajinik Babariya",
  "Priya Patel",
  "Amit Sharma",
  "Sneha Joshi",
  "Vikas Singh",
  "Anjali Mehta",
  "Rohit Verma",
  "Kiran Kumar",
  "Deepa Nair",
  "Manoj Desai",
];
const statuses = ["Success", "Failed"];

const fileNames = [
  "report_q1.xlsx",
  "data_backup_2023.xlsx",
  "sensor_log_march.xlsx",
  "client_list.xlsx",
  "export_data.xlsx",
  "water_levels.xlsx",
  "rainfall_summary.xlsx",
  "station_data_01.xlsx",
  "gps_tracking.xlsx",
  "daily_metrics.xlsx",
];

const dates = [
  "2024-06-01",
  "2024-06-02",
  "2024-06-03",
  "2024-06-04",
  "2024-06-05",
  "2024-06-06",
  "2024-06-07",
  "2024-06-08",
  "2024-06-09",
  "2024-06-10",
];

export const stationHistory = Array.from({ length: 50 }, (_, i) => {
  const performedBy = performedBys[i % performedBys.length];
  const status = statuses[i % statuses.length];
  const fileName = fileNames[Math.floor(Math.random() * fileNames.length)];
  const date = dates[Math.floor(Math.random() * dates.length)];

  return {
    key: i + 1,
    fileName,
    reason: "Auto-generated log entry",
    status,
    performedBy,
    performedOn: date,
  };
});
