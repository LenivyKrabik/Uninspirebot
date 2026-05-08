import { useEffect, useState, useRef, useContext } from "react";
import "../styles/lockInPage.css";
import useAudio from "./useAudio";
import EventEmitter from "../services/eventEmitter";
import ServicesContext from "../services/servicesContext";
import queue from "../services/simpleQueue";

import type { timedAudioResponse } from "../services/backend";

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function LockInScreen() {
  const wisdomsQueueSize = 3;

  const [lockedIn, setLockedIn] = useState(false);
  const [buttonClass, setButtonClass] = useState("enterLockInButton");
  const [textPosition, setTextPosition] = useState({ top: 0, left: 0 });
  const [wisdomCount, setWisdomCount] = useState(0);
  const [shownWisdomText, setShownWisdomText] = useState("");
  const [playingWisdomAudio, toggleWisdomAudio, changeWisdomAudio] = useAudio("");
  const [playingEffectAudio, toggleEffectAudio, changeEffectAudio] = useAudio("");
  const eventManager = useRef(new EventEmitter());
  const wisdomsQueue = useRef(new queue<timedAudioResponse>(wisdomsQueueSize));
  const fillingUpQueue = useRef(false);

  const { backend } = useContext(ServicesContext);

  const audioSettings = "data:audio/mpeg;base64,";

  const fillWisdomsQueue = async () => {
    console.log("Filling up wisdoms queue");
    fillingUpQueue.current = true;
    const amountToFill = wisdomsQueueSize - wisdomsQueue.current.size();
    const answers = backend.getTextTimedAudioWisdomBatch(amountToFill);
    for await (const audioWisdom of answers) {
      wisdomsQueue.current.enqueue(audioWisdom);
    }
    fillingUpQueue.current = false;
  };

  //Starting LockIn sesion
  const enterLockedInState = () => {
    fillWisdomsQueue();
    setButtonClass(buttonClass + " fading");
    setTimeout(() => {
      setLockedIn(true);
    }, 1000);
  };

  const lockInWisdomCycle = async () => {
    if (lockedIn) {
      if (wisdomsQueue.current.size() <= 2 && !fillingUpQueue.current) {
        console.log("Need more wisdoms");
        fillWisdomsQueue();
      }
      await delay(2000);

      if (wisdomsQueue.current.size() == 0) {
        console.log("Don't have any wisdoms");
        await delay(500);
        setWisdomCount((c) => c + 1);
      } else {
        const wisdom = wisdomsQueue.current.dequeue();
        if (wisdom === undefined) return; //ToDo: signal that can't connect to backend
        //await backend.getTestTextWisdom();
        setTextPosition({ top: getRandomInt(6, 60), left: getRandomInt(6, 50) });
        changeWisdomAudio(audioSettings + wisdom.audio);
        toggleWisdomAudio();

        //Adding typewriter effect with custom timings from alignment
        const textLength = wisdom.text.length;
        for (let charId = 0; charId <= textLength; charId++) {
          const char = wisdom.alignment.characters[charId];
          const charStartTime = wisdom.alignment.character_start_times_seconds[charId];

          setTimeout(() => {
            setShownWisdomText((c) => {
              if (char !== undefined) return c + char;
              return c;
            });
          }, charStartTime * 1000);
        }

        //Audio effects at the end of wisdom
        const audioFinishTime = wisdom.alignment.character_end_times_seconds[textLength - 1];
        setTimeout(
          () => {
            eventManager.current.emit("wisdomEnd");
            setShownWisdomText("");
            setWisdomCount((c) => c + 1);
          },
          (audioFinishTime + 1) * 1000,
        );
      }
    }
  };
  //Play sound effect
  const soundEffect = async () => {
    const audio = await backend.getSoundEffect(getRandomInt(0, 2));
    if (audio === undefined) return console.warn("Can't get soundeffect");

    changeEffectAudio(audioSettings + audio);
    toggleEffectAudio();
  };
  /*ToDo
  const visualEffect = () => {};*/

  //On mount and on unmount
  useEffect(() => {
    eventManager.current.on("wisdomEnd", () => {
      soundEffect();
    });
    /*eventManager.current.on("wisdomEnd", () => {
      visualEffect();
    });*/
  }, []);

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
