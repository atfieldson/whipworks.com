import React from 'react';
import { SimpleGrid } from '@chakra-ui/core';
import { graphql, useStaticQuery } from 'gatsby';

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
      <SEO title="Accessories" />
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
