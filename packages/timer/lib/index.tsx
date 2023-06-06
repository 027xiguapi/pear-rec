import React from "react";
import Digit from "../components/digit";
import styles from "./index.module.scss";

export default function TimerStyled({
  seconds,
  minutes,
  hours,
  days,
  isShowTitle,
}: any) {
  return (
    <div className={styles.timerContainer}>
      {days !== undefined ? (
        <Digit
          value={days}
          isShowTitle={isShowTitle}
          title="DAYS"
          addSeparator
        />
      ) : null}
      {days !== undefined ? (
        <span className={styles.separtorContainer}>
          <span className={styles.separtor} />
          <span className={styles.separtor} />
        </span>
      ) : null}
      <Digit
        value={hours}
        isShowTitle={isShowTitle}
        title="HOURS"
        addSeparator
      />
      <span className={styles.separtorContainer}>
        <span className={styles.separtor} />
        <span className={styles.separtor} />
      </span>
      <Digit
        value={minutes}
        isShowTitle={isShowTitle}
        title="MINUTES"
        addSeparator
      />
      <span className={styles.separtorContainer}>
        <span className={styles.separtor} />
        <span className={styles.separtor} />
      </span>
      <Digit value={seconds} isShowTitle={isShowTitle} title="SECONDS" />
    </div>
  );
}
