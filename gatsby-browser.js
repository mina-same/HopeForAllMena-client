import React from 'react';
import { BookstoreProvider } from './src/context/BookstoreContext';
import './src/assets/css/tailwind.css';

export const wrapRootElement = ({ element }) => {
  return (
    <BookstoreProvider>
      {element}
    </BookstoreProvider>
  );
};
