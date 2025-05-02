import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../MovieSearch/MovieSearch.css';
import { fetchPopularMovies } from '../../api';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../../components/Spinner';
import { useTranslation } from 'react-i18next';
import { Button, Space, Typography } from 'antd';

const { Title } = Typography;
const MAX_PAGES = 10;

const PopularMovies = () => {
  const { i18n, t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['popularMovies', currentPage, i18n.language],
    queryFn: () => fetchPopularMovies(currentPage, i18n.language),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <Spinner />;
  if (error) return <p>{t('error_loading_movies')}: {error.message}</p>;

  const movies = data?.results || [];

  return (
    <div className="movie-list">
      <h1 className='movie-list-title'>{t('popular_movies_title')}</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id}>
            <div key={movie.id} className="movie-card">
              <h2 className="movie-title">{movie.title}</h2>
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="no-image"></div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="pagination" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Space size="middle">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {t('previous')}
          </Button>

          <span className="pagination-page">
            {t('page')} {currentPage} {t('of')} {MAX_PAGES}
          </span>

          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= MAX_PAGES}
          >
            {t('next')}
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default PopularMovies;
