// components/MusicPlayer.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./MusicPlayer.module.css";
import Image from "next/image";
import MusicBarPreloader from "./MusicBarPreloader";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";

interface Lyric {
  time: number;
  text: string;
}

interface Song {
  id: number;
  title: string;
  singer: string;
  audio: string;
  cover: string;
  lyrics: Lyric[];
}

const MusicPlayer = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("/data/songs.json");
        if (!response.ok) throw new Error("Gagal memuat data lagu");

        const data: Song[] = await response.json();
        setSongs(data);

        // Simulate a loading delay for the preloader
        setTimeout(() => setIsLoaded(true), 1500);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    setCurrentLyricIndex(0);
    setProgress(0);
    setCurrentTime("0:00");
    setDuration("0:00");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
    }
  }, [currentSongIndex]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const current = audioRef.current.currentTime;
    const totalDuration = audioRef.current.duration;

    if (totalDuration > 0 && !isNaN(totalDuration)) {
      setProgress((current / totalDuration) * 100);
      setCurrentTime(formatTime(current));
      setDuration(formatTime(totalDuration));
    } else {
      setProgress(0);
      setCurrentTime("0:00");
      setDuration("0:00");
    }

    const song = songs[currentSongIndex];
    if (song && song.lyrics) {
      const index = song.lyrics.findIndex((lyric, i) => {
        return (
          current >= lyric.time &&
          (i === song.lyrics.length - 1 || current < song.lyrics[i + 1].time)
        );
      });
      if (index !== -1 && index !== currentLyricIndex) {
        setCurrentLyricIndex(index);
      }
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekTime =
      (Number(event.target.value) / 100) * audioRef.current.duration;
    audioRef.current.currentTime = seekTime;
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === songs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (!isLoaded) {
    return <MusicBarPreloader />;
  }

  const song = songs[currentSongIndex];

  return (
    <div className={`${styles.player} ${isLoaded ? styles.fadeIn : ""}`}>
      <div className={`${styles.vinyl} ${isPlaying ? styles.spin : ""}`}>
        <Image
          src={song.cover}
          alt={`Cover of ${song.title}`}
          width={200}
          height={200}
          className={styles.coverImage}
        />
      </div>
      <div className={styles.songInfo}>
        <h2>{song.title}</h2>
        <h3>{song.singer}</h3>
      </div>
      <div className={styles.lyrics}>
        {currentLyricIndex > 0 && (
          <p className={styles.prevLyric}>
            {song.lyrics[currentLyricIndex - 1]?.text}
          </p>
        )}
        <p className={styles.currentLyric}>
          {song.lyrics[currentLyricIndex]?.text}
        </p>
        {currentLyricIndex < song.lyrics.length - 1 && (
          <p className={styles.nextLyric}>
            {song.lyrics[currentLyricIndex + 1]?.text}
          </p>
        )}
      </div>
      <audio
        ref={audioRef}
        src={song.audio}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleNext}
      />
      <div className={styles.controls}>
        <button onClick={handlePrevious}>
          <FaBackward />
        </button>
        <button onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={handleNext}>
          <FaForward />
        </button>
      </div>
      <div className={styles.progress}>
        <span className={styles.time}>{currentTime}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
        />
        <span className={styles.time}>{duration}</span>
      </div>
    </div>
  );
};

export default MusicPlayer;
