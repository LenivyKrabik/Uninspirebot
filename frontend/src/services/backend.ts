type Alignment = {
  characters: Array<string>;
  character_start_times_seconds: Array<number>;
  character_end_times_seconds: Array<number>;
};

const backendURL = "http://localhost:3000/";

async function getTestTextWisdom() {
  try {
    const answer = await fetch(backendURL + "testTextWisdom");
    if (!answer.ok) {
      console.warn("Can't connect to backend");
      return undefined;
    } else {
      const wisdom = await answer.text();
      return wisdom;
    }
  } catch (err) {
    if (err instanceof TypeError) console.warn("Can't reach server");
    console.warn(err);
    return undefined;
  }
}

async function getTextWisdom() {
  try {
    const answer = await fetch(backendURL + "textWisdom");
    if (!answer.ok) {
      console.warn("Can't connect to backend");
      return undefined;
    } else {
      const wisdom = await answer.text();
      return wisdom;
    }
  } catch (err) {
    if (err instanceof TypeError) console.warn("Can't reach server");
    console.warn(err);
    return undefined;
  }
}

async function getTextTimedAudioWisdom(retries: number = 2): Promise<
  | {
      audio: string;
      alignment: Alignment;
      text: string;
    }
  | undefined
> {
  try {
    const answer = await fetch(backendURL + "textWisdom");
    if (answer.ok) return await answer.json();
    console.warn(`Massage from server: ${(await answer.json()).error}`);
    if ((answer.status === 500 || answer.status === 502) && retries > 0) {
      console.log(`Got server error, trying again ${retries} times`);
      return await getTextTimedAudioWisdom(retries - 1);
    } else {
      console.warn("Server keeps throwing errors, stoping trying to reach it");
      return undefined;
    }
  } catch (err) {
    if (err instanceof TypeError) console.warn("Can't reach server");
    console.warn(err);
    return undefined;
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
  try {
    const answer = await fetch(req);
    if (answer.ok) {
      const { audio } = (await answer.json()) as { audio: string };
      return audio;
    }
    switch (answer.status) {
      case 400:
        console.warn("Server recieved unexisiting sound id");
        return undefined;
      case 500:
        console.log(`Server got an error: ${(await answer.json()).error}`);
        return undefined;
    }
  } catch (err) {
    if (err instanceof TypeError) console.warn("Can't reach server");
    console.warn(err);
    return undefined;
  }
}

export default {
  getTestTextWisdom: getTestTextWisdom,
  getTextWisdom: getTextWisdom,
  getTextTimedAudioWisdom: getTextTimedAudioWisdom,
  getSoundEffect: getSoundEffect,
};
