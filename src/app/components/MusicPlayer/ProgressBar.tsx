// components/MusicPlayer/ProgressBar.tsx
import React from "react";
import styles from "./MusicPlayer.module.css";

interface ProgressBarProps {
  progress: number;
  currentTime: string;
  duration: string;
  onSeek: (value: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  currentTime,
  duration,
  onSeek,
}) => (
  <div className={styles.progress}>
    <span className={styles.time}>{currentTime}</span>
    <input
      type="range"
      min="0"
      max="100"
      value={progress}
      onChange={(e) => onSeek(Number(e.target.value))}
    />
    <span className={styles.time}>{duration}</span>
  </div>
);

export default ProgressBar;
