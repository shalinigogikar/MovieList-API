import { useState,useMemo,useCallback,useEffect } from "react";

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 const[error,setError]=useState(null);
 const [newMovie, setNewMovie] = useState({
  title: "",
  director: "",
  release_date: "",
});
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
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: value }));
  }, []);
  const handleAddMovie = useCallback(
    (e) => {
      e.preventDefault();

      if (!newMovie.title || !newMovie.director || !newMovie.release_date) {
        alert("Please fill in all fields.");
        return;
      }
      const newMovieObj = {
        episode_id: movies.length + 1, // Generate a unique ID
        title: newMovie.title,
        director: newMovie.director,
        release_date: newMovie.release_date,
      };


      console.log("New Movie Object:", newMovieObj);
      setMovies((prevMovies) => [...prevMovies, newMovieObj]);

      // Clear the form after submission
      setNewMovie({ title: "", director: "", release_date: "" });
    },
    [newMovie,movies]
  );
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
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Add Movie Form */}
      <form
        onSubmit={handleAddMovie}
        className="p-4 border rounded-lg bg-gray-100 shadow-lg w-full max-w-md"
      >
        <h2 className="text-lg font-semibold text-center mb-4">Add a Movie</h2>
        <input
          type="text"
          name="title"
          value={newMovie.title}
          onChange={handleInputChange}
          placeholder="Movie Title"
          className="w-full p-2 mb-2 border rounded-md"
        />
        <input
          type="text"
          name="director"
          value={newMovie.director}
          onChange={handleInputChange}
          placeholder="Director"
          className="w-full p-2 mb-2 border rounded-md"
        />
        <input
          type="date"
          name="release_date"
          value={newMovie.release_date}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded-md"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Movie
        </button>
      </form>
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
