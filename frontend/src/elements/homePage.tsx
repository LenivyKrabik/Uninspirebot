import { useContext, useState } from "react";
import "../styles/homePage.css";
import ServicesContext from "../services/servicesContext";

function HomePage() {
  const { backend } = useContext(ServicesContext);

  let [wisdom, setWisdom] = useState("");

  const getText = async () => {
    const wisdomReqResult = await backend.getTextWisdom();
    if (wisdomReqResult === undefined) return; //ToDo: signal that can't connect to backend
    setWisdom(wisdomReqResult);
  };

  return (
    <div className="homePage">
      <button onClick={getText}>Generate test wisdom</button>
      <h1>{wisdom}</h1>
    </div>
  );
}

export default HomePage;
