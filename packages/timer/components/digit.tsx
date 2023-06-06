import React from "react";
import styles from "./index.module.scss";

export default function Digit({ value, title, isShowTitle }: any) {
  const leftDigit = value >= 10 ? value?.toString()[0] : "0";
  const rightDigit = value >= 10 ? value?.toString()[1] : value?.toString();
  return (
    <div className={styles.container}>
      {isShowTitle ? <div className={styles.title}>{title}</div> : <></>}
      <div className={styles.digitContainer}>
        <div className={styles.singleDigit}>{leftDigit}</div>
        <div className={styles.singleDigit}>{rightDigit}</div>
      </div>
    </div>
  );
}
