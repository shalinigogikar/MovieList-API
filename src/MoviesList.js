import { useState,useMemo,useCallback,useEffect } from "react";

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 const[error,setError]=useState(null);
  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null); 
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
          throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]); 
    } finally {
      setIsLoading(false); 
    }
  },[]);
  useEffect(() => {
    fetchMovies(); 
  }, [fetchMovies]);
  const movieList = useMemo(
    () =>
      movies.map((movie) => (
          <div key={movie.episode_id} className="p-2 border rounded-lg text-center bg-white shadow-lg">
            <h3 className="font-bold text-sm mt-2">{movie.title}</h3>
            <p className="text-gray-500 text-xs">{movie.release_date}</p>
            <p className="text-gray-500 text-xs">{movie.director}</p>
          </div>
        )),[movies]);

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="border-4 border-t-4 border-blue-500 rounded-full w-10 h-10 animate-spin"></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {movieList.length > 0 ? movieList : <p>No movies found.</p>}
        </div>
      )}
    </div>
  );
}
