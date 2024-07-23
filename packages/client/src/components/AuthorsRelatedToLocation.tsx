import { trpc } from "../utils/trpc";

type Props = {
  lat: number;
  lng: number;
};

export const AuthorsRelatedToLocation = ({ lat, lng }: Props) => {
  const authorsFromLocationQuery = trpc.getAuthorsFromLocation.useQuery({
    lat,
    lng,
  });

  if (authorsFromLocationQuery.failureReason) {
    return (
      <div>
        Error getting authors : {authorsFromLocationQuery.failureReason.message}
      </div>
    );
  }

  if (!authorsFromLocationQuery.data) {
    return <div>Loading...</div>;
  }

  const { authors, location } = authorsFromLocationQuery.data;
  const { addressName } = location;

  return (
    <div className="flex flex-col items-center">
      <div className="border rounded-lg p-4 m-4 w-full shadow-md">
        <div className="text-lg font-bold mb-2">
          Authors Related to your Area (Server)
        </div>
        <div className="mb-2">Address name : {addressName}</div>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Author Name</th>
              <th className="px-4 py-2">image</th>
              <th className="px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <AuthorRow key={author.authorName} author={author} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AuthorRow = (props: { author: any }) => {
  const { authorName, image, detailedDescription } = props.author;
  const { articleBody } = detailedDescription || {};
  const { contentUrl } = image || {};

  return (
    <tr>
      <td className="border px-4 py-2">{authorName}</td>
      <td className="border px-4 py-2">
        {contentUrl ? (
          <img
            src={contentUrl}
            alt={authorName}
            className="h-20 w-20 object-cover"
          />
        ) : null}
      </td>
      <td className="border px-4 py-2">{articleBody}</td>
    </tr>
  );
};
