const backendURL = "http://localhost:3000/";

async function getTextWisdom() {
  const answer = await fetch(backendURL + "textWisdom");
  if (!answer.ok) throw new Error("Can't connect to backend");
  else {
    const wisdom = await answer.text();
    return wisdom;
  }
}

export default { getTextWisdom: getTextWisdom };
