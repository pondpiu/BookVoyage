import { trpc } from "../utils/trpc";

type Props = {
  lat: number;
  lng: number;
};

export const BooksRelatedToLocation = ({ lat, lng }: Props) => {
  const booksFromLocationQuery = trpc.getBooksRelatedToLocation.useQuery({
    lat,
    lng,
  });

  if (booksFromLocationQuery.failureReason) {
    return (
      <div>
        Error getting books : {booksFromLocationQuery.failureReason.message}
      </div>
    );
  }

  if (!booksFromLocationQuery.data) {
    return <div>Loading...</div>;
  }

  const { location, books, mode } = booksFromLocationQuery.data;
  const { addressName, localityName } = location;
  const { items } = books;
  const modeDescriptionMapping = {
    normal: "Novel in your area",
    any_book: "No novel is found, Showing any book instead",
    fallback: "No book is found, Showing novel for Brisbane instead",
  };
  return (
    <div className="flex flex-col items-center">
      <div className="border rounded-lg p-4 m-4 w-full shadow-md">
        <div className="text-lg font-bold mb-2">
          Books Related to your Area (Server)
        </div>
        <div className="mb-2">Address name : {addressName}</div>
        <div className="mb-2">
          {modeDescriptionMapping[mode] ?? "Unknown mode"}
        </div>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Book Name</th>
              <th className="px-4 py-2">Cover</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((book) => (
              <BookRow key={book.id} book={book} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BookRow = (props: { book: any }) => {
  const { volumeInfo } = props.book;
  const { title, authors, description, infoLink, imageLinks } = volumeInfo;
  const { thumbnail } = imageLinks || {};
  const truncatedDescription =
    description?.length > 250
      ? description.substring(0, 250) + "..."
      : description;
  return (
    <tr>
      <td className="border px-4 py-2">{title}</td>
      <td className="border px-4 py-2">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="h-20 w-20 object-cover" />
        ) : null}
      </td>
      <td className="border px-4 py-2">{authors}</td>
      <td className="border px-4 py-2">{truncatedDescription}</td>
    </tr>
  );
};
