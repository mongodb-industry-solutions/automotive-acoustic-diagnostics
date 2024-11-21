"use client";

import styles from "./analyticsModule.module.css";
import AnalyticsDashboard from "@/components/analyticsDashboard/AnalyticsDashboard";
import GenAIReports from "@/components/genAIReports/GenAIReports";

const AnalyticsModule = ({}) => {
  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.analyticsDashboard}>
        <AnalyticsDashboard />
      </div>
      <div className={styles.genAIReports}>
        <GenAIReports />
      </div>
    </div>
  );
};

export default AnalyticsModule;
