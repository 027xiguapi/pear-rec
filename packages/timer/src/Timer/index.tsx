import Digit from './digit';
import styles from './index.module.scss';

export default function Timer({ hours, minutes, seconds, isShowTitle }: any) {
  return (
    <div className={styles.timerContainer}>
      <Digit value={hours} isShowTitle={isShowTitle} title="HOURS" addSeparator />
      <span className="separtorContainer">
        <span className="separtor" />
        <span className="separtor" />
      </span>
      <Digit value={minutes} isShowTitle={isShowTitle} title="MINUTES" addSeparator />
      <span className="separtorContainer">
        <span className="separtor" />
        <span className="separtor" />
      </span>
      <Digit value={seconds} isShowTitle={isShowTitle} title="SECONDS" />
    </div>
  );
}
