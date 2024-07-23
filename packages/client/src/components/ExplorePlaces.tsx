import { useState } from "react";
import { trpc } from "../utils/trpc";

export const ExplorePlaces = () => {
  const [country, setCountry] = useState("Australia");
  const [searchCountry, setSearchCountry] = useState(country);
  const interestingLocalityQuery =
    trpc.getInterestingLocalityFromCountry.useQuery(country);

  const handleSearch = () => {
    setCountry(searchCountry);
  };

  const interestingLocality = interestingLocalityQuery.data;
  if (!interestingLocality) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-4">
        <label htmlFor="country" className="mr-2">
          Country:
        </label>
        <input
          type="text"
          id="country"
          value={searchCountry}
          onChange={(e) => setSearchCountry(e.target.value)}
          className="border rounded-lg px-2 py-1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white rounded-lg px-4 py-2 ml-2"
        >
          Search
        </button>
      </div>
      <div className="border rounded-lg p-4 m-4 w-full shadow-md">
        <div className="text-lg font-bold mb-2">
          Interesting Places in {country} (Server)
        </div>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Total Books</th>
              <th className="px-4 py-2">Example Book title</th>
              <th className="px-4 py-2">Example Book cover</th>
            </tr>
          </thead>
          <tbody>
            {interestingLocality.map((locality) => (
              <LocalityRow key={locality.address} locality={locality} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LocalityRow = (props: { locality: any }) => {
  const { name, books } = props.locality;
  const exampleBook = books.items?.[0];
  const { volumeInfo } = exampleBook || {};
  const { title, imageLinks } = volumeInfo || {};
  const { thumbnail } = imageLinks || {};
  return (
    <tr>
      <td className="border px-4 py-2">{name}</td>
      <td className="border px-4 py-2">{books.totalItems}</td>
      <td className="border px-4 py-2">{title}</td>
      <td className="border px-4 py-2">
        {thumbnail && <img src={thumbnail} alt={title} />}
      </td>
    </tr>
  );
};
