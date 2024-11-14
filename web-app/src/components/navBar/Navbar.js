import Link from "next/link";
import Image from "next/image";
import UserProfile from "@/components/userProfile/UserProfile";
import styles from "./navbar.module.css";
import { MongoDBLogoMark } from "@leafygreen-ui/logo";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <MongoDBLogoMark color="black" />
        </Link>
      </div>

      <div className={styles.links}>
        <Link href="/">Demo Overview</Link>
        <Link href="/digital-twin">Digital Twin</Link>
        <Link href="/acoustic-diagnostics">Acoustic Diagnostics</Link>
        <Link href="/analytics">Analytics Dashboard</Link>
      </div>

      <UserProfile></UserProfile>
    </nav>
  );
};

export default Navbar;
