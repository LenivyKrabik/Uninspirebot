import { createContext } from "react";
import backend from "./backend";

const ServicesContext = createContext({ backend: backend });
export default ServicesContext;
