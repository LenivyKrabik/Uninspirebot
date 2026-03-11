import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import ServicesContext from "./services/servicesContext";
import services from "./services/services";
import Header from "./elements/header";
import Body from "./elements/body";

function Layout() {
  return (
    <>
      <Header />
      <Body />
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ServicesContext.Provider value={services}>
      <Layout />
    </ServicesContext.Provider>
  </StrictMode>,
);
