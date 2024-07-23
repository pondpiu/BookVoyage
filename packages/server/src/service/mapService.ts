import appConfig from "../config";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface AddressResult {
  address_components: AddressComponent[];
  formatted_address: string;
}

let cacheLocationResult: { addressName: string; localityName: string };

export const getLocationFromLatLng = async (lat: number, lng: number) => {
  if (appConfig.locationResultCacheEnable) {
    if (cacheLocationResult) return cacheLocationResult;
  }
  const apiKey = appConfig.gmapsApiKey;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  const address: AddressResult = data.results[0];
  const locality = address.address_components.find(
    (component: AddressComponent) => component.types.includes("locality")
  );
  const localityName = locality?.long_name;
  if (!localityName) throw new Error("No locality name found");
  const result = {
    addressName: address.formatted_address,
    localityName,
  };
  cacheLocationResult = result;
  return result;
};

type SuburbListResult = {
  address: string;
  location: { lat: number; lng: number };
  name: string;
}[];

let cacheSuburbListResult: SuburbListResult;

export const getSuburbListFromCountry = async (countryName: string) => {
  // get list of suburb in the country from google api
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=locality+in+${encodeURIComponent(
      countryName
    )}&key=${appConfig.gmapsApiKey}`
  );
  const data = await response.json();

  const suburbList: SuburbListResult = data.results.map((result: any) => {
    return {
      address: result.formatted_address as string,
      location: result.geometry.location as { lat: number; lng: number },
      name: result.name as string,
    };
  });

  cacheSuburbListResult = suburbList;

  return suburbList;
};
