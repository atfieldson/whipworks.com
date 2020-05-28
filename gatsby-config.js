require('dotenv').config();

module.exports = {
  siteMetadata: {
    title: `WhipWorks`,
    description: `Custom made bullwhips`,
    author: `@gatsbyjs`,
  },
  plugins: [
    'gatsby-plugin-eslint',
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/specialty`,
        name: 'specialty',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/accessories`,
        name: 'accessories',
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-transformer-remark`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Josefin Sans`,
            variants: [`300`, `400`, `600`],
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-chakra-ui',
      options: {
        isResettingCSS: true, // optional, default to true
        isUsingColorMode: true, // optional, default to true
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Whipworks`,
        short_name: `Whipworks`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#1a140f`,
        display: `minimal-ui`,
        icon: `src/images/favicon_large.png`,
      },
    },
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: 'whipworks.com',
        protocol: 'https',
        hostname: 'www.whipworks.com',
      },
    },
  ],
};
