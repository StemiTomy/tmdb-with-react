// Search.jsx
import React, { useState, useRef, useEffect } from 'react';
import { bringMovies } from "../../services/apiCalls";
import { useSearch } from '../SearchContext';
import { useNavigate } from 'react-router-dom';
import './Search.css';

const Search = ({ apiKey }) => {
    const [showInput, setShowInput] = useState(false);
    const { updateMovies, updateCriteria } = useSearch();
    const [criteria, setCriteria] = useState("");
    const inputRef = useRef(null);
    const navigate = useNavigate(); // Obtén la función navigate de react-router-dom
    const currentPath = location.pathname; // Obtén la ruta actual desde useLocation


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
        updateCriteria(criteria); // Actualiza la criteria en el contexto cuando cambia
    }, [criteria, updateCriteria]);

    useEffect(() => {
        if (criteria !== "") {
            const debouncear = setTimeout(() => {
                bringMovies(criteria, apiKey)
                    .then((resultado) => {
                        updateMovies(resultado.data.results);
                        // Redirige a la ruta /Movies después de completar la búsqueda
                        navigate('/movies');
                    })
                    .catch((error) => console.log(error));
            }, 250);
            return () => clearTimeout(debouncear);
        }
    }, [criteria]);

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

export default Search;
