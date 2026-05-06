const API_KEY = process.env.ELEVENLABS_UNINSPIREBOT_API_KEY;
const maxRequestPerSecond = 10;

class ElevenlabsAuthProxy {
  httpClient: any;
  requests: number = 0;
  constructor(httpClient: any) {
    this.httpClient = httpClient;
    setInterval(() => {
      if (this.requests >= 0) this.requests--;
    }, 1000 / maxRequestPerSecond);
  }

  makeRequest(req: Request) {
    //AUTH
    if (API_KEY === undefined) throw new Error("No EL API key");
    req.headers.append("xi-api-key", API_KEY);
    //RATE-LIMIT
    if (++this.requests > maxRequestPerSecond) throw new Error("Rate limited");
    //END
    return this.httpClient.makeRequest(req);
  }
}

export default ElevenlabsAuthProxy;
