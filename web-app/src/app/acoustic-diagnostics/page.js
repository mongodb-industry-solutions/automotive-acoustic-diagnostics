"use client";

import styles from "./page.module.css";
import ExpandableCard from "@leafygreen-ui/expandable-card";
import VehicleModule from "@/components/vehicleModule/VehicleModule";
import DiagnosticsModule from "@/components/diagnosticsModule/DiagnosticsModule";
import AnalyticsModule from "@/components/analyticsModule/AnalyticsModule";
import { useState } from "react";

export default function DigitalTwin() {
  const [vehicleId, setVehicleId] = useState(null);

  return (
    <div className={styles.page}>
      <ExpandableCard
        title="Vehicle Information"
        description="General information about the vehicle and real-time audio diagnostics."
      >
        <div className={styles.modulesContainer}>
          <div className={styles.module}>
            <VehicleModule vehicleId={vehicleId} setVehicleId={setVehicleId} />
          </div>
          <div className={styles.module}>
            <DiagnosticsModule vehicleId={vehicleId} />
          </div>
        </div>
      </ExpandableCard>
      <ExpandableCard
        title="Analytics"
        description="Vehicle status analytics and AI generated reports."
      >
        <AnalyticsModule vehicleId={vehicleId} />
      </ExpandableCard>
    </div>
  );
}
