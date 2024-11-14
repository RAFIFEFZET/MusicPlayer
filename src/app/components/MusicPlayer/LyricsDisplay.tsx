// components/MusicPlayer/LyricsDisplay.tsx
import React from "react";
import styles from "./MusicPlayer.module.css";

interface LyricsDisplayProps {
  currentLyric: string;
  prevLyric?: string;
  nextLyric?: string;
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({
  currentLyric,
  prevLyric,
  nextLyric,
}) => (
  <div className={styles.lyrics}>
    {prevLyric && <p className={styles.prevLyric}>{prevLyric}</p>}
    <p className={styles.currentLyric}>{currentLyric}</p>
    {nextLyric && <p className={styles.nextLyric}>{nextLyric}</p>}
  </div>
);

export default LyricsDisplay;
