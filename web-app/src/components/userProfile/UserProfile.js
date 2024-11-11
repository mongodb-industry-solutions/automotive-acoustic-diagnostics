import styles from "./userProfile.module.css";

const UserProfile = () => {
  return (
    <div>
      <div className={styles.profile}>
        <div className={styles.imageContainer}>
          <img className={styles.image} src="/user.png" alt="User Profile" />
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
