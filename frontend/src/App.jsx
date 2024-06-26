import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import SpotDetails from "./components/SpotDetails";
import * as sessionActions from "./store/session";
import CreateSpotPage from "./components/CreateSpotsPage";
import ManageSpotsPage from "./components/ManageSpotsPage";
import UpdateSpotsPage from "./components/UpdateSpotsPage";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUserThunk()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/spots/:spotId",
        element: <SpotDetails />,
      },
      { path: "/spots/new", element: <CreateSpotPage /> },
      { path: "/spots/current", element: <ManageSpotsPage /> },
      { path: "/spots/:spotId/edit", element: <UpdateSpotsPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
