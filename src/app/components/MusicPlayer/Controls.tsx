// components/MusicPlayer/Controls.tsx
import React from "react";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaRandom,
} from "react-icons/fa";
import styles from "./MusicPlayer.module.css";

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isShuffling: boolean;
  onShuffle: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  isShuffling,
  onShuffle,
}) => (
  <div className={styles.controls}>
    <button onClick={onPrevious} aria-label="Previous Song">
      <FaBackward />
    </button>
    <button onClick={onPlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
      {isPlaying ? <FaPause /> : <FaPlay />}
    </button>
    <button onClick={onNext} aria-label="Next Song">
      <FaForward />
    </button>
    <button
      onClick={onShuffle}
      className={isShuffling ? styles.active : ""}
      aria-label="Shuffle"
    >
      <FaRandom />
    </button>
  </div>
);

export default Controls;
