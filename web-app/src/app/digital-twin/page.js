import { client } from "@/lib/mongodb";
import VehicleModel from "@/components/vehicleModel/VehicleModel";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <VehicleModel></VehicleModel>
    </div>
  );
}
