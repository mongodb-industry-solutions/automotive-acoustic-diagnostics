"use client";

import styles from "./page.module.css";
import ExpandableCard from "@leafygreen-ui/expandable-card";
import VehicleModule from "@/components/vehicleModule/VehicleModule";
import DiagnosticsModule from "@/components/diagnosticsModule/DiagnosticsModule";
import AnalyticsModule from "@/components/analyticsModule/AnalyticsModule";

export default function DigitalTwin() {
  return (
    <div className={styles.page}>
      <ExpandableCard>
        <div className={styles.modulesContainer}>
          <div className={styles.module}>
            <VehicleModule />
          </div>
          <div className={styles.module}>
            <DiagnosticsModule />
          </div>
        </div>
      </ExpandableCard>
      <ExpandableCard>
        <AnalyticsModule />
      </ExpandableCard>
    </div>
  );
}
