module.exports = {
  siteMetadata: {
    title: 'Hope For All Mena',
    description: 'Connecting, Equipment and Multiplying',
    siteUrl: 'https://www.hopeforallmena.com',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
        ignore: [`**/*.json`]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/locales`,
        name: `locale`
      }
    },
    {
      resolve: 'gatsby-plugin-react-i18next',
      options: {
        localeJsonSourceName: `locale`,
        languages: ['en', 'ar'],
        defaultLanguage: 'en',
        siteUrl: 'https://www.hopeforallmena.com',
        i18nextOptions: {
          interpolation: {
            escapeValue: false
          },
          keySeparator: '.',
          nsSeparator: false
        }
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Hope For All Mena`,
        short_name: `Hope For All`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#2194D1`,
        display: `minimal-ui`,
        icon: `src/assets/images/favicons/favicon-32x32.png`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: [`/admin/*`, `/ar/admin/*`, `/login/*`, `/ar/login/*`, `/unauthorized/*`, `/ar/unauthorized/*`, `/color-test/*`, `/ar/color-test/*`, `/index-2/*`, `/ar/index-2/*`, `/404/*`, `/ar/404/*`, `/404.html`, `/ar/404.html`, `/dev-404-page/*`],
      },
    }
  ]
};
