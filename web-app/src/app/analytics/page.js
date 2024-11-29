import styles from "./page.module.css";
import AnalyticsModule from "@/components/analyticsModule/AnalyticsModule";

export default function Home() {
  return (
    <div className={styles.page}>
      <AnalyticsModule />
    </div>
  );
}
