import React from 'react';
import { BookstoreProvider } from './src/context/BookstoreContext';
import { AuthProvider } from './src/context/AuthContext';
import { CourseProvider } from './src/context/CourseContext';
import './src/assets/css/tailwind.css';
import './src/i18n';

export const wrapRootElement = ({ element }) => {
  return (
    <AuthProvider>
      <BookstoreProvider>
        <CourseProvider>
          {element}
        </CourseProvider>
      </BookstoreProvider>
    </AuthProvider>
  );
};
