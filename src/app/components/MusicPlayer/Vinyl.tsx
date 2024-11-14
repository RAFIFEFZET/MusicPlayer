// components/MusicPlayer/Vinyl.tsx
import React from "react";
import Image from "next/image";
import styles from "./MusicPlayer.module.css";

interface VinylProps {
  cover: string;
  isPlaying: boolean;
}

const Vinyl: React.FC<VinylProps> = ({ cover, isPlaying }) => (
  <div className={`${styles.vinyl} ${isPlaying ? styles.spin : ""}`}>
    <Image
      src={cover}
      alt="Cover Image"
      width={200}
      height={200}
      className={styles.coverImage}
      priority
      placeholder="blur"
      blurDataURL="/vinyl.png" // Gambar placeholder
    />
  </div>
);

export default Vinyl;
