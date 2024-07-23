import appConfig from "../config";

let booksResponse: any;

export const getBooksFromLocality = async (
  localityName: string,
  opts?: { novelOnly?: boolean }
) => {
  if (appConfig.bookResultCacheEnable) {
    if (booksResponse) return booksResponse;
  }
  const novelOnlyQuery = opts?.novelOnly ? "+subject:Novel" : "";

  const apiKey = appConfig.booksApiKey;
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      localityName
    )}${novelOnlyQuery}&key=${apiKey}&maxResults=40&`
  );
  const data = await response.json();
  booksResponse = data;
  return data;
};

export const getBookFromId = async (bookId: string) => {
  const apiKey = appConfig.booksApiKey;
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`
  );
  const data = await response.json();
  return data;
};
