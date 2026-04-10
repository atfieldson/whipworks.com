import React from 'react';
import { Box, Heading, Text, Stack } from '@chakra-ui/react';
import { graphql, useStaticQuery, Link } from 'gatsby';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import SpecialtyWhipCard from '../components/atoms/SpecialtyWhipCard';

export const pageQuery = graphql`
  query {
    allMarkdownRemark(filter: { fields: { collection: { eq: "specialty" } } }, sort: { frontmatter: { sortOrder: ASC } }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            headerImage
            images {
              url
              caption
            }
            description
            price
          }
        }
      }
    }
  }
`;

const SpecialtyWhipsPage = () => {
  const data = useStaticQuery(pageQuery);

  return (
    <Layout>
      <SEO
        title="Specialty Whips"
        description="Browse our collection of signature specialty whips. Each design is carefully handcrafted and unique."
        structuredData={data.allMarkdownRemark.edges.map((a: any) => ({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: a.node.frontmatter.title,
          description: a.node.frontmatter.description,
          image: a.node.frontmatter.images?.[0]?.url,
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
      <Heading letterSpacing="wide" mb="2">Specialty Whips</Heading>
      <Text mb="10">
        Browse our collection of signature specialty whips. Each design is carefully handcrafted and unique.
      </Text>
      <Stack spacing={20} shouldWrapChildren>
        {data.allMarkdownRemark.edges.map((specialtyWhip: any) => {
          const whip = specialtyWhip.node.frontmatter;
          return (
            <SpecialtyWhipCard
              key={whip.title}
              headerImage={whip.headerImage}
              description={whip.description}
              title={whip.title}
              image={whip.images[0]?.url}
              slug={specialtyWhip.node.fields.slug}
              size="lg"
            />
          );
        })}
      </Stack>
      <Box mt="70px" mb="10" textAlign="center">
        <Text fontSize="lg">
          Want something unique? Design your own{' '}
          <Link to="/design-bullwhip" style={{ textDecoration: 'underline' }}>custom Bullwhip</Link>
          {' '}or{' '}
          <Link to="/design-stockwhip" style={{ textDecoration: 'underline' }}>custom Stockwhip</Link>
          {' '}from scratch!
        </Text>
      </Box>
    </Layout>
  );
};

export default SpecialtyWhipsPage;
