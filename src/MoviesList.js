import React,{useCallback, useEffect, useRef, useState} from "react";
import classes from "./MovieList.module.css";
import { MovieForm } from "./MovieForm";
const MoviesList=()=>{
    const [movies,setMovies]=useState([]);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");
    const [retry,setRetry]=useState(false);
    const retryTimeOut=useRef(null);
    const API_URL = "https://movies-f731d-default-rtdb.firebaseio.com/movies.json";
    const fetchMovies=useCallback(()=>{
        setLoading(true);
        setError("");
        fetch(API_URL)
        .then((response)=>{
          if(!response.ok){
            throw new Error("failed to fetch");
          }
        return response.json();})
        .then((data)=>{
          const loadedMovies = [];
                for (const key in data) {
                    loadedMovies.push({
                        id: key, // Firebase unique ID
                        title: data[key].title,
                        openingText: data[key].openingText,
                        releaseDate: data[key].releaseDate,
                    });
          }
          setMovies(loadedMovies);
        setLoading(false);
      setRetry(false);})
        .catch(() => {
          setError("something went Wrong...Retrying");
          setLoading(false);
        setRetry(true);
      retryTimeOut.current=setTimeout(fetchMovies,5000);});//retry for every 5seconds
    },[]);
    useEffect(()=>{
      fetchMovies();
      return()=>clearTimeout(retryTimeOut.current);
    },[fetchMovies]);
    const cancelRetry=useEffect(()=> {
      clearTimeout(retryTimeOut.current);
      setRetry(false);
      setError("Request canceled by user");
    },[]);
    const addMovieHandler = useCallback((newMovie) => {
      setLoading(true);
      fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(newMovie),
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((data) => {
            const addedMovie = { ...newMovie, id: data.name };
            setMovies((prevMovies) => [...prevMovies, addedMovie]);
            setLoading(false);
        })
        .catch(() => {
            setError("Failed to add movie");
            setLoading(false);
        });
}, []);
const deleteMovieHandler = useCallback((movieId) => {
  fetch(`https://movies-f731d-default-rtdb.firebaseio.com/movies/${movieId}.json`, {
      method: "DELETE",
  })
      .then(() => {
          setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieId));
      })
      .catch(() => {
          setError("Failed to delete movie");
      });
}, []);
    return(
        <>
        <MovieForm onAddMovie={addMovieHandler}/>
        <button onClick={fetchMovies} disabled={loading||retry} className={classes.button}>
        {loading?"loading...":"fetch Movies"}</button>
        {retry&&(
        <button onClick={cancelRetry}>Cancel</button>)}
        <ul>
        {error && <p>{error}</p>}
        {movies.map((movie) => (
          <li key={movie.id}>
            <h2>{movie.title}</h2>
           {/*<p>{movie.openingText}</p>*/}
            <small>Released: {movie.releaseDate}</small>
            <button onClick={() => deleteMovieHandler(movie.id)} className={classes.button}>Delete</button>
          </li>
        ))}
      </ul>
        </>
    );
}
export default MoviesList;