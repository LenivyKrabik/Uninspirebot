import { useContext, useState } from "react";
import "../styles/homePage.css";
import ServicesContext from "../services/servicesContext";

function HomePage() {
  const { backend } = useContext(ServicesContext);

  let [wisdom, setWisdom] = useState("");

  return (
    <div className="homePage">
      <button
        onClick={async () => {
          setWisdom(await backend.getTextWisdom());
        }}
      >
        Generate test wisdom
      </button>
      <h1>{wisdom}</h1>
    </div>
  );
}

export default HomePage;
