import React, { createContext, useContext, useReducer } from 'react';

const MapContext = createContext();

const initialState = {
  selectedLocation: null,
  filters: {
    artist: '',
    district: '',
    decade: ''
  },
  mapCenter: [114.1694, 22.3193], // Hong Kong coordinates
  zoom: 11,
  isPopupOpen: false,
  hoveredLocation: null
};

const mapReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SELECTED_LOCATION':
      return {
        ...state,
        selectedLocation: action.payload,
        isPopupOpen: !!action.payload
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case 'SET_MAP_CENTER':
      return {
        ...state,
        mapCenter: action.payload
      };

    case 'SET_ZOOM':
      return {
        ...state,
        zoom: action.payload
      };

    case 'SET_HOVERED_LOCATION':
      return {
        ...state,
        hoveredLocation: action.payload
      };

    case 'CLOSE_POPUP':
      return {
        ...state,
        selectedLocation: null,
        isPopupOpen: false
      };

    default:
      return state;
  }
};

export const MapProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  const value = {
    ...state,
    dispatch,
    setSelectedLocation: (location) =>
      dispatch({ type: 'SET_SELECTED_LOCATION', payload: location }),
    setFilters: (filters) =>
      dispatch({ type: 'SET_FILTERS', payload: filters }),
    setMapCenter: (center) =>
      dispatch({ type: 'SET_MAP_CENTER', payload: center }),
    setZoom: (zoom) =>
      dispatch({ type: 'SET_ZOOM', payload: zoom }),
    setHoveredLocation: (location) =>
      dispatch({ type: 'SET_HOVERED_LOCATION', payload: location }),
    closePopup: () =>
      dispatch({ type: 'CLOSE_POPUP' })
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};