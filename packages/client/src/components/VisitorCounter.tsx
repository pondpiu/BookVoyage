import { trpc } from "../utils/trpc";

export const VisitorCounter = () => {
  const visitorCountQuery = trpc.getSiteVisitCount.useQuery();
  const visitorCount = visitorCountQuery.data;

  return (
    <div className="container mx-auto bg-gray-100 rounded-xl shadow border p-8 m-10">
      <p className="text-3xl text-gray-700 font-bold mb-5">Visitor Counter</p>
      <p className="text-gray-500 text-lg mb-5">
        You are visitor number: {visitorCount}
      </p>
    </div>
  );
};
