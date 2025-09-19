const path = require('path');
const { languages } = require('./languages');

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  // Don't modify the 404 page - let it be handled normally
  if (page.path === '/404/') {
    return;
  }

  // Delete the original page (since we're going to recreate it)
  deletePage(page);

  // Create the new page with client-side routing
  createPage({
    ...page,
    matchPath: page.path === '/' ? '/' : `${page.path}*`,
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
};

// Override development 404 behavior
exports.onCreateDevServer = ({ app }) => {
  app.get('*', (req, res, next) => {
    // Skip Gatsby internal routes and static files
    if (req.url.startsWith('/__') ||
      req.url.startsWith('/static/') ||
      req.url.startsWith('/page-data/') ||
      req.url.includes('.')) {
      return next();
    }

    // List of valid pages (from your pages directory)
    const validPages = [
      '/', '/404', '/about', '/admin', '/become-volunteer', '/bookDetails', '/books', '/bookstore',
      '/cause-details', '/causes', '/color-test', '/contact', '/development-department',
      '/evangelism-discipleship', '/event-details', '/events', '/gallery', '/index-2',
      '/login', '/magazines', '/news-details', '/news', '/publishing-house', '/services',
      '/studies-education', '/unauthorized', '/volunteers', '/magazines/request', '/courses', '/training',
      '/enrollment', '/donate', '/map',
      '/calendar',
      '/TrainingFollowUpRequestPage', '/TrainingNewRequestPage', '/TrainingSelectionPage'
    ];

    // Check if the requested URL is a valid page or language-prefixed page
    const isValidPage = validPages.some(page => {
      // Check direct page match
      if (req.url === page || req.url.startsWith(page + '/')) {
        return true;
      }
      
      // Check language-prefixed pages
      return languages.some(lang => {
        const langPage = `/${lang}${page === '/' ? '' : page}`;
        return req.url === langPage || req.url.startsWith(langPage + '/');
      });
    });

    // Check for language-prefixed dynamic routes
    const isDynamicRoute = languages.some(lang => 
      req.url.startsWith(`/${lang}/admin/`) ||
      req.url.startsWith(`/${lang}/book/`) ||
      req.url.startsWith(`/${lang}/news-details/`)
    ) || req.url.startsWith('/admin/') ||
        req.url.startsWith('/book/') ||
        req.url.startsWith('/news-details/');

    // If not a valid page, redirect to 404
    if (!isValidPage && !isDynamicRoute) {
      return res.redirect('/404/');
    }

    next();
  });
};

// Handle 404 pages in production
exports.onCreateWebpackConfig = ({ actions, stage }) => {
  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      resolve: {
        fallback: {
          fs: false,
          path: false,
        },
      },
    });
  }
};
