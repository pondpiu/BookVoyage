import { useState } from "react";
import { ExploreBooks } from "./ExploreBooks";
import { VisitorCounter } from "./VisitorCounter";
import { ExploreAuthors } from "./ExploreAuthors";

export const MainPage = () => {
  return (
    <div className="bg-gray-200 p-10">
      <div className="container mx-auto bg-gray-100 rounded-xl shadow border p-8 mb-10">
        <p className="text-3xl text-gray-700 font-bold mb-5">
          Welcome to BookVoyage
        </p>
        <p className="text-gray-500 text-lg">
          Explore books and authors around you
        </p>
        <p className="text-gray-500 text-lg">
          From book lovers, for book lovers
        </p>
      </div>

      <div>
        <VisitorCounter />
      </div>
      <div>
        <TabNavigation />
      </div>
    </div>
  );
};

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  return (
    <div>
      <div className="flex justify-center items-center space-x-4">
        <button
          className={`${
            activeTab === 0
              ? "bg-blue-400 text-white"
              : "bg-gray-200 text-gray-700"
          } px-4 py-2 rounded-lg`}
          onClick={() => handleTabClick(0)}
        >
          Explore Books
        </button>
        <button
          className={`${
            activeTab === 1
              ? "bg-blue-400 text-white"
              : "bg-gray-200 text-gray-700"
          } px-4 py-2 rounded-lg`}
          onClick={() => handleTabClick(1)}
        >
          Explore Authors
        </button>
      </div>
      <div className="container mx-auto bg-gray-100 rounded-xl shadow border p-8 m-10">
        {activeTab === 0 && <ExploreBooks />}
        {activeTab === 1 && <ExploreAuthors />}
      </div>
    </div>
  );
};
