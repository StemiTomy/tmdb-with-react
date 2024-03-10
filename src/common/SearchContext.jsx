// SearchContext.js
import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [movies, setMovies] = useState([]);
    const [criteria, setCriteria] = useState("");

    const updateMovies = (newMovies) => {
        setMovies(newMovies);
    };

    const updateCriteria = (newCriteria) => {
        setCriteria(newCriteria);
    };

    return (
        <SearchContext.Provider value={{ movies, updateMovies, criteria, updateCriteria, currentPage, setCurrentPage, totalPages, setTotalPages }}>
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
