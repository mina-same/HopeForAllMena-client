const path = require('path');

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
      '/', '/404', '/about', '/admin', '/become-volunteer', '/bookDetils', '/books', '/bookstore',
      '/cause-details', '/causes', '/color-test', '/contact', '/development-department',
      '/evangelism-discipleship', '/event-details', '/events', '/gallery', '/index-2',
      '/login', '/magazines', '/news-details', '/news', '/publishing-house', '/services',
      '/studies-education', '/unauthorized', '/volunteers', '/magazines/request', '/courses', '/training',
      '/enrollment',
      '/TrainingFollowUpRequestPage', '/TrainingNewRequestPage', '/TrainingSelectionPage'
    ];

    // Check if the requested URL is a valid page
    const isValidPage = validPages.some(page =>
      req.url === page ||
      req.url.startsWith(page + '/') ||
      req.url.startsWith('/admin/')
    );

    // If not a valid page, redirect to 404
    if (!isValidPage) {
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
