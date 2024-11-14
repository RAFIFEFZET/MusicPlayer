// components/MusicPlayer/MusicPlayer.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./MusicPlayer.module.css";
import Vinyl from "./Vinyl";
import Controls from "./Controls";
import LyricsDisplay from "./LyricsDisplay";
import ProgressBar from "./ProgressBar";
import MusicBarPreloader from "./MusicBarPreloader";

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

const MusicPlayer: React.FC = () => {
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

  const handleSeek = (value: number) => {
    if (!audioRef.current) return;
    const seekTime = (value / 100) * audioRef.current.duration;
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
      <Vinyl cover={song.cover} isPlaying={isPlaying} />
      <div className={styles.songInfo}>
        <h2>{song.title}</h2>
        <h3>{song.singer}</h3>
      </div>
      <LyricsDisplay
        currentLyric={song.lyrics[currentLyricIndex]?.text || ""}
        prevLyric={
          currentLyricIndex > 0
            ? song.lyrics[currentLyricIndex - 1]?.text
            : undefined
        }
        nextLyric={
          currentLyricIndex < song.lyrics.length - 1
            ? song.lyrics[currentLyricIndex + 1]?.text
            : undefined
        }
      />
      <audio
        ref={audioRef}
        src={song.audio}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleNext}
      />
      <Controls
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
      <ProgressBar
        progress={progress}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
      />
    </div>
  );
};

export default MusicPlayer;
