import { useState, useEffect, useRef } from "react";

const useAudio = (url: string) => {
  let audio = useRef(new Audio(url));
  const [playingAudio, setPlayingAudio] = useState(false);

  const toggleAudio = () => setPlayingAudio(!playingAudio);

  const changeAudio = (url: string) => {
    audio.current.removeEventListener("ended", () => {
      setPlayingAudio(false);
    });
    audio.current = new Audio(url);
    audio.current.addEventListener("ended", () => setPlayingAudio(false));
  };

  useEffect(() => {
    playingAudio ? audio.current.play() : audio.current.pause();
  }, [playingAudio]);

  useEffect(() => {
    audio.current.addEventListener("ended", () => setPlayingAudio(false));
    return () => {
      audio.current.removeEventListener("ended", () => setPlayingAudio(false));
    };
  }, []);

  return { playingAudio, toggleAudio, changeAudio };
};

export default useAudio;
