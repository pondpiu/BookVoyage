import path from "path";
// require("dotenv").config({ path: path.join(__dirname, "../../../.env") });

const appConfig = {
  dbUri: process.env.DATABASE_URL as unknown as string,
  gmapsApiKey: process.env.GMAPS_API_KEY as unknown as string,
  booksApiKey: process.env.BOOKS_API_KEY as unknown as string,
  kgApiKey: process.env.KG_API_KEY as unknown as string,
  locationResultCacheEnable:
    process.env.LOCATION_RESULT_CACHE_ENABLE === "true",
  bookResultCacheEnable: process.env.BOOK_RESULT_CACHE_ENABLE === "true",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as unknown as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as unknown as string,
  sessionToken: process.env.AWS_SESSION_TOKEN as unknown as string,
};

export default appConfig;
