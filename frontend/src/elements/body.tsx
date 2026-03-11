import { useContext, useState } from "react";
import "../styles/body.css";
import ServicesContext from "../services/servicesContext";

function Body() {
  const { backend } = useContext(ServicesContext);

  let [wisdom, setWisdom] = useState("");

  return (
    <div className="body">
      <button
        onClick={() => {
          setWisdom(backend.getTextWisdom());
        }}
      >
        Generate wisdom
      </button>
      <h1>{wisdom}</h1>
    </div>
  );
}

export default Body;
