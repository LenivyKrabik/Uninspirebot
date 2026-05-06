class httpRequestWraper {
  async makeRequest(req: Request) {
    return await fetch(req);
  }
}

export default httpRequestWraper;
