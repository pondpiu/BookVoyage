import express from "express";
import cors from "cors";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
import {
  getLocationFromLatLng,
  getSuburbListFromCountry,
} from "./service/mapService";
import { getBookFromId, getBooksFromLocality } from "./service/bookService";
import { getSiteVisitCount } from "./service/visitCounterService";
import { getInformationFromAuthorName } from "./service/knowledgeService";

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
const appRouter = t.router({
  getBooksRelatedToLocation: t.procedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
      })
    )
    .query(async (opts) => {
      const { input } = opts;
      const { lat, lng } = input;
      const location = await getLocationFromLatLng(lat, lng);
      const novelBooks = await getBooksFromLocality(location.localityName, {
        novelOnly: true,
      });
      if (novelBooks.totalItems > 0)
        return { location, books: novelBooks, mode: "normal" };
      const anyBooks = await getBooksFromLocality(location.localityName);
      if (anyBooks.totalItems > 0)
        return { location, books: anyBooks, mode: "any_book" };
      const brisbaneNovel = await getBooksFromLocality("Brisbane City", {
        novelOnly: true,
      });
      return { location, books: brisbaneNovel, mode: "fallback" };
    }),
  getInterestingLocalityFromCountry: t.procedure
    .input(z.string())
    .query(async (opts) => {
      const { input } = opts;
      const countryName = input;
      const suburbs = await getSuburbListFromCountry(countryName);
      const suburbWithBooks = await Promise.all(
        suburbs.map(async (suburb) => {
          const books = await getBooksFromLocality(suburb.name, {
            novelOnly: true,
          });
          return { ...suburb, books };
        })
      );
      suburbWithBooks.sort((a, b) => {
        return b.books.totalItems - a.books.totalItems;
      });
      return suburbWithBooks;
    }),
  getSiteVisitCount: t.procedure.query(async () => {
    const count = await getSiteVisitCount();
    return count;
  }),
  getBookInfoWithAuthorDetail: t.procedure
    .input(z.string())
    .query(async (opts) => {
      const { input } = opts;
      console.log({ input });
      if (!input) return null;
      const bookId = input;
      const book = await getBookFromId(bookId);
      const authorName = book.volumeInfo?.authors?.[0];
      const authorInfo = await getInformationFromAuthorName(authorName);
      return { book, authorInfo };
    }),
  getAuthorsFromLocation: t.procedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
      })
    )
    .query(async (opts) => {
      const { input } = opts;
      const { lat, lng } = input;
      const location = await getLocationFromLatLng(lat, lng);
      let bookList;
      const anyBooks = await getBooksFromLocality(location.localityName);
      if (anyBooks.totalItems > 0) {
        bookList = anyBooks;
      } else {
        const brisbaneNovel = await getBooksFromLocality("Brisbane", {
          novelOnly: true,
        });
        bookList = brisbaneNovel;
      }
      const authorMap = {};
      await Promise.all(
        bookList.items.map(async (book: any) => {
          const authorName = book.volumeInfo?.authors?.[0];
          if (!authorName) return null;
          if (authorMap[authorName]) return null;
          const authorInfo = await getInformationFromAuthorName(authorName);
          authorMap[authorName] = { authorName, ...authorInfo };
        })
      );
      const filtered = Object.values(authorMap).filter(
        (author) => author?.detailedDescription
      );
      const result = { location, authors: filtered };
      return result;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(4000);
