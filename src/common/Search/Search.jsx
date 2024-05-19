// Search.jsx
import { useState, useRef, useEffect } from 'react';
import { bringMovies } from "../../services/apiCalls";
import { useSearch } from '../SearchContext';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Search.css';

const Search = ({ apiKey }) => {
    const [showInput, setShowInput] = useState(false);
    const { updateMovies, updateCriteria, currentPage, setCurrentPage, setTotalPages } = useSearch();
    const [criteria, setCriteria] = useState("");
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const currentPath = location.pathname;


    const handleButtonClick = () => {
        setShowInput(!showInput);
        if (currentPath === '/movies') navigate('/popular');
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [showInput]);

    useEffect(() => {
        updateCriteria(criteria);
    }, [criteria, updateCriteria]);

    const performSearch = () => {
        const debouncear = setTimeout(() => {
            bringMovies(criteria, apiKey, currentPage)
                .then((resultado) => {
                    updateMovies(resultado.data.results);
                    setTotalPages(resultado.data.total_pages);
                    navigate('/movieSearch');
                })
                .catch((error) => console.log(error));
        }, 250);
        return () => clearTimeout(debouncear);
    };

    // Efecto para manejar cambios en los criterios de búsqueda
    useEffect(() => {
        if (criteria !== "") {
            setCurrentPage(1); // Restablece la página a 1 solo si la búsqueda cambia
            performSearch();
        }
    }, [criteria]);

    // Efecto para manejar cambio de página
    useEffect(() => {
        if (criteria !== "") {
            performSearch();
        }
    }, [currentPage]);

    return (
        <div className="search-container">
            <button className="button" onClick={handleButtonClick}>
                Search
            </button>
            {showInput && <input
                className="input"
                ref={inputRef}
                type="text"
                name="criteria"
                placeholder="Enter your search"
                onChange={(e) => setCriteria(e.target.value)} />}
        </div>
    );
};

Search.propTypes = {
    apiKey: PropTypes.func.isRequired,
};

export default Search;
