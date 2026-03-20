type Alignment = {
  characters: Array<string>;
  character_start_times_seconds: Array<number>;
  character_end_times_seconds: Array<number>;
};

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
  alignment: Alignment;
  text: string;
}> {
  const answer = await fetch(backendURL + "textTimedAudio");
  if (!answer.ok) throw new Error("Can't connect to backend");
  else {
    const wisdom = await answer.json();
    return wisdom;
  }
}

async function getSoundEffect(id: number) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const req = new Request(backendURL + "soundEffect", {
    method: "POST",
    body: JSON.stringify({
      id: id,
    }),
    headers: headers,
  });
  const answer = await fetch(req);
  if (!answer.ok) throw new Error("Can't connect to backend");
  else {
    const { audio } = (await answer.json()) as { audio: string };
    return audio;
  }
}

export default {
  getTestTextWisdom: getTestTextWisdom,
  getTextWisdom: getTextWisdom,
  getTextTimedAudioWisdom: getTextTimedAudioWisdom,
  getSoundEffect: getSoundEffect,
};
