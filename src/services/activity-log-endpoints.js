import axios from "axios";

const customError = new Error("Network error or no response");
const BASE_URL = "http://localhost:5001";
// const BASE_URL = "https://sdoic-ilearn.depedimuscity.com:5005";

// Get all activity logs with pagination
function getAllActivityLogs(limit = 100, offset = 0) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/activity-logs`, {
        params: { limit, offset },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject(customError);
        }
      });
  });
}

// Get activity logs by user ID
function getActivityLogsByUserId(userId, limit = 50) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/activity-logs/user/${userId}`, {
        params: { limit },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject(customError);
        }
      });
  });
}

// Get activity logs count
function getActivityLogsCount() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/activity-logs/count`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject(customError);
        }
      });
  });
}

// Delete old activity logs
function deleteOldActivityLogs(daysToKeep = 90) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${BASE_URL}/activity-logs/cleanup`, {
        params: { daysToKeep },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject(customError);
        }
      });
  });
}

// Export activity logs (simple)
function exportActivityLogs(limit = 1000, filename = "Activity_Logs") {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${BASE_URL}/activity-logs/export`,
        { limit, filename },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject(customError);
        }
      });
  });
}

// Export activity logs with summary (complete report)
function exportActivityLogsWithSummary(
  filename = "Activity_Logs_Complete_Report"
) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${BASE_URL}/activity-logs/export-summary`,
        { filename },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject(customError);
        }
      });
  });
}

// Download a generated report
function downloadReport(fileName) {
  return `${BASE_URL}/activity-logs/download/${fileName}`;
}

// Get list of generated reports
function getGeneratedReports() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/activity-logs/reports/list`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject(customError);
        }
      });
  });
}

// Delete a specific report
function deleteReport(fileName) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${BASE_URL}/activity-logs/reports/${fileName}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject(customError);
        }
      });
  });
}

// Delete old reports
function deleteOldReports(daysToKeep = 30) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${BASE_URL}/activity-logs/reports/cleanup-old`, {
        params: { daysToKeep },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject(customError);
        }
      });
  });
}

export default {
  getAllActivityLogs,
  getActivityLogsByUserId,
  getActivityLogsCount,
  deleteOldActivityLogs,
  exportActivityLogs,
  exportActivityLogsWithSummary,
  downloadReport,
  getGeneratedReports,
  deleteReport,
  deleteOldReports,
};
