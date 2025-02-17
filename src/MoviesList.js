import { useState } from "react";

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {
    setIsLoading(true); 
    try {
      const response = await fetch("https://swapi.dev/api/films");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Data:", data); 

      if (Array.isArray(data.results) && data.results.length > 0) {
        setMovies(data.results);
      } else {
        setMovies([]); 
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]); 
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <button
        onClick={fetchMovies}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? "Loading Movies..." : "Fetch Movies"}
      </button>

      {isLoading && (
        <div className="border-4 border-t-4 border-blue-500 rounded-full w-10 h-10 animate-spin"></div>
      )}

      {/* Display movies when available */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {movies.map((movie) => (
            <div key={movie.episode_id} className="p-2 border rounded-lg text-center bg-white shadow-lg">
              <h3 className="font-bold text-sm mt-2">{movie.title}</h3>
              <p className="text-gray-500 text-xs">{movie.release_date}</p>
              <p className="text-gray-500 text-xs">{movie.director}</p>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-gray-500">No movies found.</p>
      )}
    </div>
  );
}
