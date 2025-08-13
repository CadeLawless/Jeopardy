import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function RouteWatcher() {
  const location = useLocation();

  useEffect(() => {
    //console.log(location.pathname);

    if (location.pathname !== "/game-boards/create") {
      localStorage.removeItem("gameBoard");
    }

    // Replace :id with a wildcard check if you want to match any ID
    if (!location.pathname.startsWith("/game-boards/") || !location.pathname.endsWith("/edit")) {
      localStorage.removeItem("gameData");
    }
  }, [location]);

  return null; // no UI needed
}

export default RouteWatcher;