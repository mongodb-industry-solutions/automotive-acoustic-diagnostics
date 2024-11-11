import Link from "next/link";
import Image from "next/image";
import UserProfile from "@/components/userProfile/UserProfile";
import styles from "./navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="MongoDB logo"
            className={styles.logoImage}
            width={240}
            height={50}
          ></Image>
        </Link>
      </div>

      

      <div className={styles.links}>
        <Link href="/">Demo Overview</Link>
        <Link href="/equipment-criticality-analysis">Digital Twin</Link>
        <Link href="/failure-prediction">Acoustic Diagnostics</Link>
        <Link href="/repair-plan-generation">Analytics Dashboard</Link>
      </div>

      <UserProfile></UserProfile>

    
    </nav>
  );
};

export default Navbar;