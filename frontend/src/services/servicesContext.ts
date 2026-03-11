import { createContext } from "react";
import backend from "./backend";

const ServicesContext = createContext<any>({ backend: backend });
export default ServicesContext;
