module.exports = {
  siteMetadata: {
    title: 'Hope For All Mena',
    description: 'Connecting, Equipment and Multiplying',
    siteUrl: 'http://localhost:8000',
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
        siteUrl: 'http://localhost:8000',
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
    `gatsby-plugin-sharp`
  ]
};
