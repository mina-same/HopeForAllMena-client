const path = require('path');
const { languages } = require('./languages');

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  // Make the 404 page a catch-all (/* or /ar/*) so any unknown URL renders the
  // custom 404 component — in `gatsby develop` too, instead of Gatsby's dev 404 page.
  const notFoundMatch = page.path.match(/^(\/[a-z]{2})?\/404\/$/);
  if (notFoundMatch) {
    const langPrefix = notFoundMatch[1] || '';
    deletePage(page);
    createPage({
      ...page,
      matchPath: `${langPrefix}/*`,
    });
    return;
  }

  // Don't modify root pages — they're static and gatsby-plugin-react-i18next
  // needs them left alone for client-side language detection to work correctly.
  // Adding matchPath: '/' here breaks back-button navigation to the home page.
  const isRoot = page.path === '/' || /^\/[a-z]{2}\/$/.test(page.path);
  if (isRoot) {
    return;
  }

  // Delete the original page (since we're going to recreate it)
  deletePage(page);

  // Create the new page with client-side routing
  createPage({
    ...page,
    matchPath: `${page.path}*`,
  });
};

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  // Create a catch-all page for client-side routing
  createPage({
    path: '/admin/*',
    component: path.resolve('./src/pages/admin.jsx'),
    matchPath: '/admin/*',
  });

  // Create specific route for blog editing
  createPage({
    path: '/admin/blog/edit/*',
    component: path.resolve('./src/pages/admin.jsx'),
    matchPath: '/admin/blog/edit/*',
  });

  // Create dynamic book detail pages
  createPage({
    path: '/book/*',
    component: path.resolve('./src/pages/bookDetils.jsx'),
    matchPath: '/book/*',
  });

  // Create dynamic news detail pages
  createPage({
    path: '/news-details/*',
    component: path.resolve('./src/pages/news-details.jsx'),
    matchPath: '/news-details/*',
  });

  // The section was renamed to Alexandria Bible College; keep the old slug working.
  const { createRedirect } = actions;
  ['', ...languages.map((lang) => `/${lang}`)].forEach((prefix) => {
    createRedirect({
      fromPath: `${prefix}/studies-education`,
      toPath: `${prefix}/alexandria-bible-college`,
      isPermanent: true,
      redirectInBrowser: true,
    });
  });
};

// Handle 404 pages in production and resolve dependency conflicts
exports.onCreateWebpackConfig = ({ actions, stage }) => {
  const config = {
    resolve: {
      fallback: {
        fs: false,
        path: false,
      },
    },
  };

  // Handle build-time dependency conflicts
  if (stage === 'build-html' || stage === 'develop-html') {
    config.resolve.alias = {
      // Force all date-fns imports to use the same version
      'date-fns': path.resolve(__dirname, 'node_modules/date-fns'),
      // Force all lodash imports to use the same version
      'lodash': path.resolve(__dirname, 'node_modules/lodash'),
    };
  }

  // Handle client-side build
  if (stage === 'build-javascript' || stage === 'develop') {
    config.resolve.alias = {
      'date-fns': path.resolve(__dirname, 'node_modules/date-fns'),
      'lodash': path.resolve(__dirname, 'node_modules/lodash'),
    };
  }

  actions.setWebpackConfig(config);
};
