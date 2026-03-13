import { useEffect, useState } from "react";
import "../styles/lockInPage.css";

function LockInScreen() {
  const [lockedIn, setLockedIn] = useState(false);
  const [buttonClass, setButtonClass] = useState("enterLockInButton");
  const [topDistance, setTopDistance] = useState(0);
  const [leftDistance, setLeftDistance] = useState(0);

  //Starting LockIn sesion
  const enterLockedInState = () => {
    setButtonClass(buttonClass + " fading");
    setTimeout(() => {
      setLockedIn(true);
    }, 1000);
  };

  if (!lockedIn) {
    return (
      <div className="lockInBody">
        <button onClick={enterLockedInState} className={buttonClass}>
          Lock IN
        </button>
      </div>
    );
  } else {
    let wisdomNumber = 0;

    useEffect(() => {
      //Need to put logic for whole cycle
      wisdomNumber++;
    }, [wisdomNumber]);

    return (
      <div className="lockInBody">
        <div
          style={{
            position: "static",
            top: topDistance + "%",
            left: leftDistance + "%",
          }}
        ></div>
      </div>
    );
  }
}

export default LockInScreen;
