import React from 'react';
import { BookstoreProvider } from './src/context/BookstoreContext';
import { AuthProvider } from './src/context/AuthContext';
import { CourseProvider } from './src/context/CourseContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/lib/queryClient';
import './src/i18n';

export const wrapRootElement = ({ element }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookstoreProvider>
          <CourseProvider>
            {element}
          </CourseProvider>
        </BookstoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
