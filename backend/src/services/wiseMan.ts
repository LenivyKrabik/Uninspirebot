import memoize from "../memoizationFunction.ts";
import WisdomBuilder from "../wisdomBuilder.ts";
import wisdomComponentsStorage from "../wisdomComponentsStorage.json" with { type: "json" };

const parseResponse = async (rep: Response) => {
  return await rep.json();
};

class WiseMan {
  proxy: any;
  voiceId: string;
  audioOutputFormat: string;
  makeRequest: Function;
  parseResponse: Function;

  wisdomGenerator = new WisdomBuilder(wisdomComponentsStorage);

  constructor(proxy: any, settings: { voiceId: string; audioOutputFormat: string; totalyDBPath: string }) {
    this.proxy = proxy;
    this.voiceId = settings.voiceId;
    this.audioOutputFormat = settings.audioOutputFormat;

    this.makeRequest = this.proxy.makeRequest;
    this.parseResponse = memoize(parseResponse, settings.totalyDBPath, "unlimited", "LFU");
  }

  Text = () => {
    const wisdom = this.wisdomGenerator.createWisdom();
    let wisdomText = wisdom.showText();

    wisdomText = wisdomText.charAt(0).toUpperCase() + wisdomText.slice(1);
    if (wisdomText.charAt(wisdomText.length - 1) !== ".") wisdomText += ".";
    return wisdomText;
  };

  TimedAudio = async () => {
    const text = this.Text();
    if (text.length >= 300) throw new Error("Wisdom too long");

    //Making request to elevenlabs
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const reply = await this.makeRequest(
      new Request(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}/with-timestamps`, {
        method: "POST",
        body: JSON.stringify({
          text: text,
          output_format: this.audioOutputFormat,
        }),
        headers: headers,
      }),
    );

    const replyObject = await this.parseResponse(reply);
    if (replyObject.audio_base64 === undefined) {
      throw new Error("No audio property in reply");
    }

    //Process reply
    const timedAudio = {
      audio: replyObject.audio_base64,
      alignment: replyObject.alignment,
      text: text,
    };
    return timedAudio;
  };
}

export default WiseMan;
