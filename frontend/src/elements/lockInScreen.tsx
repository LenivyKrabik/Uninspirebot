import { useEffect, useRef, useState } from "react";
import "../styles/lockInPage.css";
import backend from "../services/backend";
import Player from "./player";

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function LockInScreen() {
  const [lockedIn, setLockedIn] = useState(false);
  const [buttonClass, setButtonClass] = useState("enterLockInButton");
  const [textPosition, setTextPosition] = useState({ top: 0, left: 0 });
  const [wisdomCount, setWisdomCount] = useState(0);

  //Starting LockIn sesion
  const enterLockedInState = () => {
    setButtonClass(buttonClass + " fading");
    setTimeout(() => {
      setLockedIn(true);
    }, 1000);
  };

  const lockInWisdomCycle = async () => {
    if (lockedIn) {
      //await backend.getTextTimedAudioWisdom();
      //await backend.getTestTextWisdom();
      setTextPosition({ top: getRandomInt(6, 80), left: getRandomInt(6, 80) });
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
            width: "100px",
            height: "100px",
          }}
        >
          <Player url={"data:audio/mpeg;base64,"} />
        </div>
      </div>
    );
  }
}

export default LockInScreen;
