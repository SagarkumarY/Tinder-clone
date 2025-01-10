import React, { useEffect, useState } from "react";
import { Heart, Loader, MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";
function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  // const loading = false;
  // const matches = [
  //   {
  //     _id: "1",
  //     name: "Alice Johnson",
  //     image: "https://randomuser.me/api/portraits/women/1.jpg",
  //   },

  //   {
  //     _id: "2",
  //     name: "Michael Smith",
  //     image: "https://randomuser.me/api/portraits/men/2.jpg",
  //   },
  //   {
  //     _id: "3",
  //     name: "Sophia Brown",
  //     image: "https://randomuser.me/api/portraits/women/3.jpg",
  //   },
  // ];

  const { getMyMatches, matches, isLoadingMyMathes } = useMatchStore();

  useEffect(() => {
    getMyMatches(); // Call the getMyMatches function to fetch the user's matches when the component mounts.
    // You can also add other logic here to handle fetching matches. For example, if the user's matches are already cached, you can use the cached data instead of making a new API call.
  }, [getMyMatches]);

  return (
    <>
      <div
        className={`
        fixed inset-y-0 z-10 w-64 bg-white shadow-md overflow-hidden  transition-transformd duration-300 ease-in-out ${
          isOpen ? "translate-x-0 " : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:w-1/4
     `}
      >
        <div className="flex flex-col h-full">
          {/* {"Header"} */}

          <div className="p-4 pb-[27px] border-b border-pink-200 flex  justify-between items-center">
            <h2 className="text-xl font-bold text-pink-600">Matches</h2>

            <button
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleSidebar}
            >
              <X size={24} />
            </button>
          </div>

          {/* {"scroll content"} */}
          <div className="flex-grow overflow-y-auto p-4 z-10 relative">
            {isLoadingMyMathes  ? (
              <LoadingState />
            ) : matches.length === 0 ? (
              <NoMatchesFound />
            ) : (
              matches.map((match) => {
                return (
                  <Link key={match._id} to={`/chat/${match._id}`}>
                    <div className="flex items-center mb-4 cursor-pointer hover:bg-pink-50 p-2 rounded-lg transition-colors duration-300">
                      <img
                        src={match.image || "/avatar.png"}
                        alt="User avatar"
                        className="size-12 object-cover rounded-full mr-3 border-2 border-pink-300"
                      />
                      <h3 className="font-semibold text-gray-800">
                        {match.name}
                      </h3>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      <button
        className="lg:hidden fixed top-4 left-4 p-2 bg-pink-500 text-white rounded-md z-0"
        onClick={toggleSidebar}
      >
        <MessageCircle size={24} />
      </button>
    </>
  );
}

export default Sidebar;

const NoMatchesFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Heart className="text-pink-400 mb-4" size={48} />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Matches Yet
      </h3>
      <p className="text-gray-500 max-w-xs">
        Don't worry! Your perfect match is just around the corner. Keep swiping!
      </p>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Loader className="text-pink-500 mb-4 animate-spin" size={48} />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Loading Matches
      </h3>
      <p className="text-gray-500 max-w-xs">
        We're finding your perfect matches. This might take a moment...
      </p>
    </div>
  );
};
