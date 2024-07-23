import { BooksRelatedToLocation } from "./BooksRelatedToLocation";
import { useEffect, useState } from "react";

export const ExploreBooks = () => {
  const MAP_API_KEY = import.meta.env.VITE_MAP_API_KEY;

  const [coords, setCoords] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    // get geolocation using google api as Native Geolocation API required HTTPS
    fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${MAP_API_KEY}`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setCoords(data.location);
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  }, []);

  if (errorMsg !== "") {
    return (
      <div className="text-center mt-4">
        Error getting coordinate : {errorMsg}
      </div>
    );
  }

  return coords ? (
    <div className="flex flex-col">
      <div className="border rounded-lg p-4 shadow-md mb-4 w-2/4">
        <div className="text-lg font-bold mb-2">Geolocation API (Client)</div>
        <table>
          <tbody>
            <tr>
              <td className="font-bold pr-2">latitude:</td>
              <td>{coords.lat}</td>
            </tr>
            <tr>
              <td className="font-bold pr-2">longitude:</td>
              <td>{coords.lng}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <BooksRelatedToLocation lat={coords.lat} lng={coords.lng} />
    </div>
  ) : (
    <div className="text-center mt-4">Getting the location data&hellip; </div>
  );
};
