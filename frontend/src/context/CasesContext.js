import React, { createContext, useState, useContext } from 'react';

const CasesContext = createContext();

export const CasesProvider = ({ children }) => {
    const [cases, setCases] = useState([]);

    const addCase = (caseData) => setCases(prev => [caseData, ...prev]);

    return (
        <CasesContext.Provider value={{ cases, addCase }}>
            {children}
        </CasesContext.Provider>
    );
};

export const useCases = () => useContext(CasesContext);