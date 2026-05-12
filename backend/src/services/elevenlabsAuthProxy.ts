const API_KEY = process.env.ELEVENLABS_UNINSPIREBOT_API_KEY;
const delayBetweenResponses = 100; //In ms

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

class ElevenlabsAuthProxy {
  httpClient: any;
  lastRequested: Date = new Date(0);
  constructor(httpClient: any) {
    this.httpClient = httpClient;
    /*setInterval(() => {
      if (this.requests >= 0) this.requests--;
    }, 1000 / maxRequestPerSecond);*/
  }

  makeRequest = async (req: Request) => {
    //AUTH
    if (API_KEY === undefined) throw new Error("No EL API key");
    req.headers.append("xi-api-key", API_KEY);
    //RATE-LIMIT
    const currentTime = Date.now();
    const timeD = currentTime - this.lastRequested.getTime();
    if (timeD < delayBetweenResponses) await delay(delayBetweenResponses - timeD);
    this.lastRequested = new Date();
    /*if (++this.requests > maxRequestPerSecond) throw new Error("Rate limited");*/

    //END
    return this.httpClient.makeRequest(req);
  };
}

export default ElevenlabsAuthProxy;
