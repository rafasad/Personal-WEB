/* eslint-disable no-console */
import React, { useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

export const WebsitePageContext = createContext();

export const WebsitePageProvider = ({ children }) => {
  const [isModalLoading, setLoadingState] = useState(false);

  const toggleModalLoading = (trueOrFalse = null) => {
    if (trueOrFalse === null) {
      setLoadingState(!isModalLoading);
    } else {
      setLoadingState(trueOrFalse);
    }
  };

  return (
    <WebsitePageContext.Provider
      value={{
        isModalLoading,
        toggleModalLoading,
      }}
    >
      {children}
    </WebsitePageContext.Provider>
  );
};
WebsitePageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useWebsitePage = () => useContext(WebsitePageContext);
