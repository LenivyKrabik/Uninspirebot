import { useEffect, useState } from "react";
import "../styles/lockInPage.css";
import backend from "../services/backend";
import useAudio from "./player";

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function LockInScreen() {
  const [lockedIn, setLockedIn] = useState(false);
  const [buttonClass, setButtonClass] = useState("enterLockInButton");
  const [textPosition, setTextPosition] = useState({ top: 0, left: 0 });
  const [wisdomCount, setWisdomCount] = useState(0);
  const [shownWisdomText, setShownWisdomText] = useState("");
  const { playingAudio, toggleAudio, changeAudio } = useAudio("");

  const audioSettings = "data:audio/mpeg;base64,";

  //Starting LockIn sesion
  const enterLockedInState = () => {
    setButtonClass(buttonClass + " fading");
    setTimeout(() => {
      setLockedIn(true);
    }, 1000);
  };

  const lockInWisdomCycle = async () => {
    if (lockedIn) {
      const wisdom = await backend.getTextTimedAudioWisdom();
      //await backend.getTestTextWisdom();
      setTextPosition({ top: getRandomInt(6, 60), left: getRandomInt(6, 50) });
      changeAudio(audioSettings + wisdom.audio);
      toggleAudio();

      //Adding typewriter effect with custom timings from alignment
      const textLength = wisdom.text.length;
      for (let charId = 0; charId <= textLength; charId++) {
        const char = wisdom.alignment.characters[charId];
        const charStartTime =
          wisdom.alignment.character_start_times_seconds[charId];

        setTimeout(() => {
          setShownWisdomText((c) => {
            if (char !== undefined) return c + char;
            return c;
          });
        }, charStartTime * 1000);
      }

      const audioFinishTime =
        wisdom.alignment.character_end_times_seconds[textLength - 1];
      setTimeout(
        () => {
          setShownWisdomText("");
          setWisdomCount((c) => c + 1);
        },
        (audioFinishTime + 1) * 1000,
      );

      //wisdomcount++;
    }
  };

  useEffect(() => {
    lockInWisdomCycle();
  }, [wisdomCount]);

  if (!lockedIn) {
    return (
      <div className="lockInBody">
        <button onClick={enterLockedInState} className={buttonClass}>
          Lock IN
        </button>
      </div>
    );
  } else {
    if (wisdomCount === 0) setWisdomCount(1);
    return (
      <div className="lockInBody">
        <div
          style={{
            position: "absolute",
            top: textPosition.top + "%",
            left: textPosition.left + "%",
            width: "600px",
            height: "100px",
          }}
        >
          <h1 className="wisdomText">{shownWisdomText}</h1>
        </div>
      </div>
    );
  }
}

export default LockInScreen;
