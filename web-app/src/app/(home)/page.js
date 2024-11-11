import styles from "./page.module.css";
import DemoOverview from "@/components/demoOverview/DemoOverview";

export default function Home() {
  return (
    <div className={styles.page}>
      <DemoOverview></DemoOverview>
    </div>
  );
}
