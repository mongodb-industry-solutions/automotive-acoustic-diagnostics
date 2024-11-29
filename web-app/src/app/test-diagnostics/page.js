import DiagnosticsModule from "@/components/diagnosticsModule/DiagnosticsModule";
import styles from "./page.module.css";

export default function AcousticDiagnostics() {
  return (
    <div className={styles.page}>
      <DiagnosticsModule />
    </div>
  );
}
