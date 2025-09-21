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
    `gatsby-transformer-json`,
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
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`
  ]
};
