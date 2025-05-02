// src/utils/getCssVariable.js

/**
 * Obtiene el valor de una variable CSS definida en :root
 * @param {string} variableName - El nombre de la variable CSS, por ejemplo '--color-primary'
 * @returns {string} - El valor de la variable (sin espacios)
 */
export const getCssVariable = (variableName) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
};
