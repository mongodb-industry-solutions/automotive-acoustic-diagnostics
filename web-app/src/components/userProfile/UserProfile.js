import styles from "./userProfile.module.css";
import Image from "next/image";

const UserProfile = () => {
  return (
    <div>
      <div className={styles.profile}>
        <div className={styles.imageContainer}>
          <Image
            className={styles.image}
            src="/user.png"
            alt="User Profile"
            height={20}
            width={20}
          />
        </div>
        <div className={styles.details}>
          <div className={styles.name}>Fred Strauss</div>
          <div className={styles.role}>Mechanic</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
