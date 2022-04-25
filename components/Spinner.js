import styles from "../styles/Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles["lds-dual-ring"]}></div>
    </div>
  );
};

export default Spinner;
