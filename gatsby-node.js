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

// AEO: write public/llms.txt (a plain-text site summary for AI answer engines) from the
// built pages' own <title> and meta description, so it never drifts from the site content.
const writeLlmsTxt = (reporter) => {
  const fs = require('fs');
  const pub = path.join(__dirname, 'public');
  const site = 'https://www.hopeforallmena.com';
  const blocked = /^(ar\/)?(admin|login|unauthorized|color-test|index-2|404|dev-404-page|bookDetils|news-details|event-details|cause-details|orderPage|Calendar|MagazineRequestPage|page-data|static|_gatsby|~partytown)(\/|$)/;
  const decode = (t) => t.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const read = (rel) => {
    const html = fs.readFileSync(path.join(pub, rel, 'index.html'), 'utf8');
    const title = (html.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1];
    const desc = (html.match(/name="description" content="([^"]*)"/) || [])[1];
    return title ? { url: `${site}/${rel}`, title: decode(title), desc: desc ? decode(desc) : '' } : null;
  };
  const pages = [];
  const walk = (rel) => {
    for (const e of fs.readdirSync(path.join(pub, rel), { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const child = rel ? `${rel}${e.name}/` : `${e.name}/`;
      if (blocked.test(child) || child.includes('*')) continue;
      if (fs.existsSync(path.join(pub, child, 'index.html'))) {
        const pg = read(child);
        if (pg) pages.push(pg);
      }
      walk(child);
    }
  };
  walk('');
  const home = read('');
  const line = (pg) => `- [${pg.title}](${pg.url})${pg.desc ? `: ${pg.desc}` : ''}`;
  const en = pages.filter((pg) => !pg.url.startsWith(`${site}/ar/`)).sort((a, b) => a.url.localeCompare(b.url));
  const ar = pages.filter((pg) => pg.url.startsWith(`${site}/ar/`)).sort((a, b) => a.url.localeCompare(b.url));
  const out = [
    `# ${home.title}`,
    '',
    `> ${home.desc}`,
    '',
    'Contact: hope4allmena@gmail.com · Alexandria +20 155 510 3774 · Cairo +20 128 141 6629',
    '',
    '## Pages (English)',
    ...en.map(line),
    '',
    '## الصفحات (العربية)',
    `- [${home.title}](${site}/ar/)`,
    ...ar.map(line),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(pub, 'llms.txt'), out);
  reporter.info(`llms.txt written with ${pages.length + 1} pages`);
};

// SEO / speed: shrink the built images in public/static (originals in src/ are untouched).
// Resizes anything wider than 1920px and recompresses; a file is only replaced if it gets smaller.
exports.onPostBuild = async ({ reporter }) => {
  writeLlmsTxt(reporter);
  const fs = require('fs');
  const sharp = require('sharp');
  const dir = path.join(__dirname, 'public', 'static');
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f));
  let before = 0;
  let after = 0;
  for (const file of files) {
    const filePath = path.join(dir, file);
    const input = fs.readFileSync(filePath);
    before += input.length;
    try {
      let img = sharp(input, { failOn: 'none' }).rotate().resize({ width: 1920, withoutEnlargement: true });
      img = /\.png$/i.test(file)
        ? img.png({ compressionLevel: 9, effort: 8 })
        : img.jpeg({ quality: 78, mozjpeg: true });
      const output = await img.toBuffer();
      if (output.length < input.length) {
        fs.writeFileSync(filePath, output);
        after += output.length;
      } else {
        after += input.length;
      }
    } catch (e) {
      after += input.length;
      reporter.warn(`Image optimize skipped ${file}: ${e.message}`);
    }
  }
  reporter.info(`Optimized ${files.length} images: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);

  // Modern format: make a .webp next to each image and point the built HTML/CSS/JS/JSON at it
  // when it is smaller. Originals stay in place, so any reference we miss still works.
  // App/touch icons stay PNG (iOS needs PNG).
  const renames = [];
  for (const file of files) {
    if (/^(apple-touch-icon|favicon|android-chrome|icon)/i.test(file)) continue;
    const filePath = path.join(dir, file);
    const webpName = file.replace(/\.(jpe?g|png)$/i, '.webp');
    try {
      const webp = await sharp(fs.readFileSync(filePath), { failOn: 'none' }).webp({ quality: 78 }).toBuffer();
      if (webp.length < fs.statSync(filePath).size) {
        fs.writeFileSync(path.join(dir, webpName), webp);
        renames.push([file, webpName]);
      }
    } catch (e) {
      reporter.warn(`WebP skipped ${file}: ${e.message}`);
    }
  }
  const pub = path.join(__dirname, 'public');
  const textFiles = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (/\.(html|css|js|json)$/i.test(e.name)) textFiles.push(full);
    }
  };
  walk(pub);
  let rewritten = 0;
  for (const f of textFiles) {
    let text = fs.readFileSync(f, 'utf8');
    const original = text;
    for (const [from, to] of renames) {
      for (const [a, b] of [[from, to], [encodeURI(from), encodeURI(to)]]) {
        if (text.includes(`static/${a}`)) text = text.split(`static/${a}`).join(`static/${b}`);
      }
    }
    if (text !== original) {
      fs.writeFileSync(f, text);
      rewritten += 1;
    }
  }
  reporter.info(`WebP: ${renames.length} images converted, references updated in ${rewritten} files`);
};
