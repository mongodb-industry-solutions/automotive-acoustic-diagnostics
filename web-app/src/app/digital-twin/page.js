import { client } from "@/lib/mongodb";
import VehicleModule from "@/components/vehicleModule/VehicleModule";
import styles from "./page.module.css";

export default function DigitalTwin() {
  return (
    <div className={styles.page}>
      <VehicleModule></VehicleModule>
    </div>
  );
}
