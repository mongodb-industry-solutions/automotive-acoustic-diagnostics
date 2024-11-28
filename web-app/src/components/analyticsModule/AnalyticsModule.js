"use client";

import styles from "./analyticsModule.module.css";
import AnalyticsDashboard from "@/components/analyticsDashboard/AnalyticsDashboard";
import GenAIReports from "@/components/genAIReports/GenAIReports";

const AnalyticsModule = ({ vehicleId }) => {
  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.analyticsDashboard}>
        <AnalyticsDashboard vehicleId={vehicleId} />
      </div>
      <div className={styles.genAIReports}>
        <GenAIReports vehicleId={vehicleId} />
      </div>
    </div>
  );
};

export default AnalyticsModule;
