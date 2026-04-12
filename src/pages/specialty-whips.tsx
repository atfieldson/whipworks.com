import React from 'react';
import { Box, Grid, Heading, Image, Text } from '@chakra-ui/react';
import { graphql, useStaticQuery, Link } from 'gatsby';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import SpecialtyWhipGridCard from '../components/atoms/SpecialtyWhipGridCard';

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
            series
            seriesImage
            isNew
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

type RenderItem =
  | { type: 'standalone'; whip: any; slug: string }
  | { type: 'series-group'; seriesName: string; seriesImage: string; whips: { whip: any; slug: string }[] };

const groupWhips = (edges: any[]): RenderItem[] => {
  const items: RenderItem[] = [];
  const seriesMap = new Map<string, number>();

  for (const edge of edges) {
    const whip = edge.node.frontmatter;
    const slug = edge.node.fields.slug;
    const series = whip.series;

    if (series) {
      if (seriesMap.has(series)) {
        // Add to existing series group
        const idx = seriesMap.get(series)!;
        (items[idx] as any).whips.push({ whip, slug });
      } else {
        // Create new series group
        seriesMap.set(series, items.length);
        items.push({
          type: 'series-group',
          seriesName: series,
          seriesImage: whip.seriesImage,
          whips: [{ whip, slug }],
        });
      }
    } else {
      items.push({ type: 'standalone', whip, slug });
    }
  }

  return items;
};

const SpecialtyWhipsPage = () => {
  const data = useStaticQuery(pageQuery);
  const renderItems = groupWhips(data.allMarkdownRemark.edges);

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
          image: a.node.frontmatter.images?.map((img: any) => img.url) || [],
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

      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gap={{ base: 8, md: 8 }}
        rowGap={{ base: 10, md: 12 }}
      >
        {renderItems.map((item) => {
          if (item.type === 'standalone') {
            return (
              <SpecialtyWhipGridCard
                key={item.whip.title}
                title={item.whip.title}
                headerImage={item.whip.headerImage}
                images={item.whip.images}
                price={item.whip.price}
                slug={item.slug}
                isNew={item.whip.isNew}
              />
            );
          }

          // Series group: banner + whip cards
          return (
            <React.Fragment key={item.seriesName}>
              {/* Series banner spanning both columns */}
              <Box
                gridColumn="1 / -1"
                textAlign="center"
                pt="6"
                pb="2"
                borderTop="1px solid"
                borderColor="whiteAlpha.200"
              >
                {item.seriesImage ? (
                  <Image
                    src={item.seriesImage}
                    maxH="80px"
                    maxW="400px"
                    objectFit="contain"
                    alt={`${item.seriesName} logo`}
                    mx="auto"
                  />
                ) : (
                  <Heading fontSize="xl" letterSpacing="wider">
                    {item.seriesName}
                  </Heading>
                )}
              </Box>

              {/* Series whips */}
              {item.whips.map(({ whip, slug }) => (
                <SpecialtyWhipGridCard
                  key={whip.title}
                  title={whip.title}
                  headerImage={whip.headerImage}
                  images={whip.images}
                  price={whip.price}
                  slug={slug}
                  isNew={whip.isNew}
                />
              ))}

              {/* Series closing divider */}
              <Box
                gridColumn="1 / -1"
                borderBottom="1px solid"
                borderColor="whiteAlpha.200"
              />
            </React.Fragment>
          );
        })}
      </Grid>

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
