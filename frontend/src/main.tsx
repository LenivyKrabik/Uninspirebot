import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import ServicesContext from "./services/servicesContext";
import services from "./services/services";
import Header from "./elements/header";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import HomePage from "./elements/homePage";
import LockInScreen from "./elements/lockInScreen";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/lockIn", element: <LockInScreen /> },
    ],
  },
]);
function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ServicesContext.Provider value={services}>
      <RouterProvider router={router} />
    </ServicesContext.Provider>
  </StrictMode>,
);
