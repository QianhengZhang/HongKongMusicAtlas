import React, { createContext, useContext, useReducer } from 'react';

const LanguageContext = createContext();

const initialState = {
  language: localStorage.getItem('preferred-language') || 'en', // 'en' for English, 'zh' for Chinese
  translations: {}
};

const languageReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload
      };
    case 'SET_TRANSLATIONS':
      return {
        ...state,
        translations: action.payload
      };
    default:
      return state;
  }
};

export const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  const setLanguage = (language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    localStorage.setItem('preferred-language', language);
  };

  const setTranslations = (translations) => {
    dispatch({ type: 'SET_TRANSLATIONS', payload: translations });
  };

  const t = (key, fallback = '') => {
    const translation = state.translations[state.language]?.[key];
    return translation || fallback || key;
  };

  const value = {
    ...state,
    setLanguage,
    setTranslations,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
