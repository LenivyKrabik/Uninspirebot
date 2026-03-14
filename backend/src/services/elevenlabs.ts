///
///    THIS FILE IS A MESS ON PURPOSE
///
//Implementation 0
/*import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const API_KEY = process.env.$ELEVENLABS_UNINSPIREBOT_API_KEY;
const voiceModelID = "iiidtqDt9FBdT1vfBluA";

const client = new ElevenLabsClient();

if (API_KEY === undefined) {
  throw new Error("Couldn't get API key for elevenlabs");
}

const ttsWithTimedAudio = async (text: string) => {
  const answer = await client.textToSpeech.convertWithTimestamps(API_KEY, {
    text: text,
    modelId: voiceModelID,
  });
  return answer;
};

export default ttsWithTimedAudio;*/

//Doing all of this while imagining that elevenlabs npm package does not exist
//Also if not labs witohut package it still would be more practical to use builder
const API_KEY = process.env.ELEVENLABS_UNINSPIREBOT_API_KEY;

//Implementation 1 (with function)
/*
const AuthProxy = (url: string, options: RequestInit) => {
  return new Proxy(new Request(url, options), {
    apply(target, thisArg, argumentsList) {
      if (API_KEY === undefined) throw new Error("Can't get API key");
      target.headers.append("xi-api-key", API_KEY);
      return fetch(target);
    },
  });
};
*/

//Implementation 2
type AuthMethod = "OAuth" | "API Key" | "JWT";

class AuthProxyElevenlabs {
  private authMethod: AuthMethod;
  constructor(method: AuthMethod = "API Key") {
    this.authMethod = method;
  }
  makeRequest(url: string, options: RequestInit = {}) {
    const request = new Request(url, options);
    switch (this.authMethod) {
      case "OAuth":
        console.log("Not implemented yet");
        break;
      case "API Key":
        if (API_KEY === undefined) throw new Error("Can't get API key");
        request.headers.append("xi-api-key", API_KEY);
        return fetch(request);
      case "JWT":
        console.log("Not implemented yet");
        break;
    }
  }
  swapAuthMethod(method: AuthMethod) {
    this.authMethod = method;
  }
}

export default AuthProxyElevenlabs;
