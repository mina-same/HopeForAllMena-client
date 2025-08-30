import React from 'react';
import { BookstoreProvider } from './src/context/BookstoreContext';

export const wrapRootElement = ({ element }) => {
  return (
    <BookstoreProvider>
      {element}
    </BookstoreProvider>
  );
};
