import appConfig from "../config";

export const getInformationFromAuthorName = async (authorName: string) => {
  //https://kgsearch.googleapis.com/v1/entities:search?query=taylor%20swift&key=[YOUR_API_KEY] HTTP/1.1
  const apiKey = appConfig.kgApiKey;
  const response = await fetch(
    `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(
      authorName
    )}&key=${apiKey}&limit=1&indent=True`
  );
  const data = await response.json();
  const result = data.itemListElement?.[0]?.result;
  return result;
};
