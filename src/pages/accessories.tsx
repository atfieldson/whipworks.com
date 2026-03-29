import React from 'react';
import { SimpleGrid, Text, Box } from '@chakra-ui/react';
import { graphql, useStaticQuery, Link } from 'gatsby';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import AccessoryCard from '../components/molecules/AccessoryCard';

export const pageQuery = graphql`
  query {
    allMarkdownRemark(filter: { fields: { collection: { eq: "accessories" } } }) {
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

const AccessoriesPage = () => {
  const data = useStaticQuery(pageQuery);

  return (
    <Layout>
      <SEO
        title="Whip Accessories"
        description="Whipmaking accessories and extras from WhipWorks."
        structuredData={data.allMarkdownRemark.edges.map((a: any) => ({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: a.node.frontmatter.title,
          description: a.node.frontmatter.description,
          image: a.node.frontmatter.images?.[0],
          brand: {
            '@type': 'Brand',
            name: 'WhipWorks',
          },
          offers: {
            '@type': 'Offer',
            url: `https://www.whipworks.com${a.node.fields.slug}`,
            priceCurrency: 'USD',
            price: a.node.frontmatter.price,
            availability: 'https://schema.org/InStock',
          },
        }))}
      />
      <Box mb="6">
        <Text>
          Looking for a custom whip instead? Design your own{' '}
          <Link to="/design-bullwhip" style={{ textDecoration: 'underline' }}>Bullwhip</Link>
          {' '}or{' '}
          <Link to="/design-stockwhip" style={{ textDecoration: 'underline' }}>Stockwhip</Link>.
        </Text>
      </Box>
      <SimpleGrid spacing="6" minChildWidth="200px">
        {data.allMarkdownRemark.edges.map((a: any) => {
          const product = a.node.frontmatter;
          return (
            <AccessoryCard
              key={product.title}
              title={product.title}
              image={product.images && product.images[0]}
              price={product.price}
              slug={a.node.fields.slug}
            />
          );
        })}
      </SimpleGrid>
    </Layout>
  );
};

export default AccessoriesPage;
