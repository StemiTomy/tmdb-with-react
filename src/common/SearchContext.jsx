// SearchContext.js
import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [movies, setMovies] = useState([]);
    const [criteria, setCriteria] = useState("");

    const updateMovies = (newMovies) => {
        setMovies(newMovies);
    };

    const updateCriteria = (newCriteria) => {
        setCriteria(newCriteria);
    };

    return (
        <SearchContext.Provider value={{ movies, updateMovies, criteria, updateCriteria }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
