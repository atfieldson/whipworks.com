import React from 'react';
import { SimpleGrid, Text, Box, Heading } from '@chakra-ui/react';
import { graphql, Link } from 'gatsby';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import AccessoryCard from '../components/molecules/AccessoryCard';

const WhipmakingMaterialsPage = ({ data }: any) => {
  return (
    <Layout>
      <SEO
        title="Whipmaking Materials"
        description="Quality whipmaking materials and supplies from WhipWorks. Paracord, conchos, core material, fids, handle rods, and more."
        structuredData={data.allMarkdownRemark.edges.map((m: any) => ({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: m.node.frontmatter.title,
          description: m.node.frontmatter.description,
          image: m.node.frontmatter.images?.[0],
          brand: {
            '@type': 'Brand',
            name: 'WhipWorks',
          },
          offers: {
            '@type': 'Offer',
            url: `https://www.whipworks.com${m.node.fields.slug}`,
            priceCurrency: 'USD',
            price: m.node.frontmatter.price,
            availability: 'https://schema.org/InStock',
          },
        }))}
      />
      <Heading as="h1" fontSize="2xl" mb="4">
        Whip Making Tools and Materials
      </Heading>
      <Box mb="6">
        <Text>
          Everything you need to make your own whips. All materials ship for a flat rate of $9,
          or free when ordered with a custom whip!
        </Text>
      </Box>
      <SimpleGrid spacing="6" minChildWidth="200px">
        {data.allMarkdownRemark.edges.map((m: any) => {
          const product = m.node.frontmatter;
          return (
            <AccessoryCard
              key={product.title}
              title={product.title}
              image={product.images && product.images[0]}
              price={product.price}
              slug={m.node.fields.slug}
            />
          );
        })}
      </SimpleGrid>
      <Box mt="8">
        <Text>
          Looking for a custom whip instead? Design your own{' '}
          <Link to="/design-bullwhip" style={{ textDecoration: 'underline' }}>Bullwhip</Link>
          {' '}or{' '}
          <Link to="/design-stockwhip" style={{ textDecoration: 'underline' }}>Stockwhip</Link>.
        </Text>
      </Box>
    </Layout>
  );
};

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { collection: { eq: "materials" } } }
      sort: { frontmatter: { sortOrder: ASC } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            images
            price
            description
          }
        }
      }
    }
  }
`;

export default WhipmakingMaterialsPage;
