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

// Google Analytics 4 — only added when GATSBY_GA_MEASUREMENT_ID is set at build time
// (e.g. GATSBY_GA_MEASUREMENT_ID=G-XXXXXXXXXX in the hosting env vars or .env.production).
export const onRenderBody = ({ setHeadComponents }) => {
  const gaId = process.env.GATSBY_GA_MEASUREMENT_ID;
  if (!gaId) return;
  setHeadComponents([
    <script key="ga4-src" async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />,
    <script
      key="ga4-init"
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
      }}
    />,
  ]);
};
