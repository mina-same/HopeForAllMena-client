import React from 'react';
import { BookstoreProvider } from './src/context/BookstoreContext';
import { AuthProvider } from './src/context/AuthContext';
import { CourseProvider } from './src/context/CourseContext';
import './src/assets/css/tailwind.css';
import './src/i18n';

// Development only: while `gatsby develop` rebuilds a page (e.g. right after a file is edited),
// a client-side navigation can briefly get "not found" for that page's data and the open tab
// keeps showing Gatsby's dev 404 screen until it is reloaded. Reload once automatically instead.
// The per-path flag in sessionStorage stops a reload loop on URLs that really don't exist.
const Dev404Recovery = ({ isDev404, pathname, children }) => {
  React.useEffect(() => {
    const key = `dev404-reloaded:${pathname}`;
    try {
      if (!isDev404) {
        sessionStorage.removeItem(key);
        return;
      }
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch (e) {
      if (!isDev404) return;
    }
    window.location.reload();
  }, [isDev404, pathname]);
  return children;
};

export const wrapPageElement = ({ element, props }) => {
  if (process.env.NODE_ENV !== 'development') return element;
  const pathname = props.location?.pathname || '';
  const resolvedPath = props.pageResources?.page?.path || '';
  const isDev404 = resolvedPath.includes('dev-404-page') && !pathname.includes('dev-404-page');
  return (
    <Dev404Recovery isDev404={isDev404} pathname={pathname}>
      {element}
    </Dev404Recovery>
  );
};

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
