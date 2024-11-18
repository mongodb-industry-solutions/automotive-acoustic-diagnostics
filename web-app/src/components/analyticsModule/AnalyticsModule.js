"use client";

import styles from "./analyticsModule.module.css";
import AnalyticsDashboard from "@/components/analyticsDashboard/AnalyticsDashboard";
import GenAIReports from "@/components/genAIReports/GenAIReports";

const AnalyticsModule = ({}) => {
  return (
    <>
      <AnalyticsDashboard />
      <GenAIReports />
    </>
  );
};

export default AnalyticsModule;
