const backendURL = "http://localhost:3000/";

async function getTestTextWisdom() {
  const answer = await fetch(backendURL + "testTextWisdom");
  if (!answer.ok) throw new Error("Can't connect to backend");
  else {
    const wisdom = await answer.text();
    return wisdom;
  }
}

async function getTextWisdom() {
  const answer = await fetch(backendURL + "textWisdom");
  if (!answer.ok) throw new Error("Can't connect to backend");
  else {
    const wisdom = await answer.text();
    return wisdom;
  }
}

async function getTextTimedAudioWisdom(): Promise<{
  audio: string;
  alignment: any;
  text: string;
}> {
  const answer = await fetch(backendURL + "textTimedAudio");
  if (!answer.ok) throw new Error("Can't connect to backend");
  else {
    const wisdom = await answer.json();
    return wisdom;
  }
}

export default {
  getTestTextWisdom: getTestTextWisdom,
  getTextWisdom: getTextWisdom,
  getTextTimedAudioWisdom: getTextTimedAudioWisdom,
};
