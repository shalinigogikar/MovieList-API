import React,{useState,useCallback} from 'react';
import classes from "./MovieForm.module.css";
export const MovieForm=({onAddMovie})=>{
    const [newMovie, setNewMovie] = useState({ title: "", openingText: "", releaseDate: "" });
    const addMovieHandler= useCallback((event) => {
        event.preventDefault();
        const newMovieObj = { 
            title: newMovie.title, 
            openingText: newMovie.openingText, 
            releaseDate: newMovie.releaseDate 
          };
    console.log(newMovieObj);
    onAddMovie(newMovieObj);
        setNewMovie({ title: "", openingText: "", releaseDate: "" });
      }, [newMovie,onAddMovie]);
    
      const inputChangeHandler = useCallback((event) => {
        const { name, value } = event.target;
        setNewMovie((prevMovie) => ({ ...prevMovie, [name]: value }));
      }, []);
    
    return(
        <>
        <form onSubmit={addMovieHandler} className={classes.form}>
        <input type="text" name="title" placeholder="Title" value={newMovie.title} onChange={inputChangeHandler} required />
        <textarea name="openingText" placeholder="Opening Text" value={newMovie.openingText} onChange={inputChangeHandler} required />
        <input type="date" name="releaseDate" value={newMovie.releaseDate} onChange={inputChangeHandler} required />
        <button type="submit" className={classes.button}>Add Movie</button>
      </form>
      </>
    );
}