// components/MusicPlayer/Controls.tsx
import React from "react";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import styles from "./MusicPlayer.module.css";

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}) => (
  <div className={styles.controls}>
    <button onClick={onPrevious}>
      <FaBackward />
    </button>
    <button onClick={onPlayPause}>
      {isPlaying ? <FaPause /> : <FaPlay />}
    </button>
    <button onClick={onNext}>
      <FaForward />
    </button>
  </div>
);

export default Controls;
