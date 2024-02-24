import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    title: `WhipWorks`,
    description: `Custom made bullwhips`,
    author: `Adam Fieldson`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-image',
    'gatsby-transformer-remark',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-snipcart-advanced',
      options: {
        publicApiKey: 'NmQxZjU4MTctZmMzZS00MmY0LWJiNWMtMWZjNjA0ZDhlYjE5NjM3MjQ4MDQyMTc1MjE1ODcw',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/specialty`,
        name: 'specialty',
      },
      __key: 'specialty',
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/accessories`,
        name: 'accessories',
      },
      __key: 'accessories',
    },
    {
      resolve: '@chakra-ui/gatsby-plugin',
      options: {
        resetCSS: true,
        portalZIndex: undefined,
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
  ],
};

export default config;
