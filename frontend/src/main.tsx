import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
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
    <Layout />
  </StrictMode>,
);
