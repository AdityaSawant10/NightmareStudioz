import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieList.css';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="movie-list-page">
        <h1 className="page-title">Now Showing</h1>
        <div className="movies-grid">
          {movies.map(movie => (
            <div key={movie.id} className="movie-card">
              <div className="movie-image">
                <img src={movie.image} alt={movie.title} onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/6366f1/ffffff?text=' + encodeURIComponent(movie.title);
                }} />
              </div>
              <div className="movie-info">
                <h2 className="movie-title">{movie.title}</h2>
                <p className="movie-description">{movie.description}</p>
                <div className="movie-meta">
                  <span className="movie-duration">⏱️ {movie.duration}</span>
                  <span className="movie-price">₹{movie.price}</span>
                </div>
                <button 
                  className="book-button"
                  onClick={() => navigate(`/book/${movie.id}`)}
                >
                  Book Tickets
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieList;
