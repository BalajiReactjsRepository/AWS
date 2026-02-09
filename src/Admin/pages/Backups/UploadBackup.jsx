import React, { useState } from "react";
import UploadTab from "./UploadTab";
import LogsTab from "./LogsTab";

const UploadBackup = () => {
  const [backupType, setBackupType] = useState("upload");

  return (
    <div>
      <nav>
        <div className="nav nav-tabs">
          <button
            className={`nav-link ${backupType === "upload" ? "active" : ""}`}
            type="button"
            onClick={() => setBackupType("upload")}
          >
            Upload
          </button>

          <button
            className={`nav-link ${backupType === "logs" ? "active" : ""}`}
            type="button"
            onClick={() => setBackupType("logs")}
          >
            Logs
          </button>
        </div>
      </nav>

      <div className="tab-content mt-3">
        {backupType === "upload" && (
          <div className="tab-pane fade show active">
            <UploadTab />
          </div>
        )}
        {backupType === "logs" && (
          <div className="tab-pane fade show active">
            <LogsTab />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadBackup;
