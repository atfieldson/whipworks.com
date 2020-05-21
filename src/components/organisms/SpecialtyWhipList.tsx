import React from 'react';
import { Stack } from '@chakra-ui/core';
import { graphql, useStaticQuery } from 'gatsby';

import SpecialtyWhipCard from '../atoms/SpecialtyWhipCard';

export const pageQuery = graphql`
  query {
    allMarkdownRemark(filter: { fields: { collection: { eq: "specialty" } } }, limit: 4) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            headerImage
            images
            description
          }
        }
      }
    }
  }
`;

const SpecialtyWhipList = () => {
  const data = useStaticQuery(pageQuery);

  return (
    <Stack spacing={20} shouldWrapChildren>
      {data.allMarkdownRemark.edges.map((specialtyWhip: any, index: number) => {
        const whip = specialtyWhip.node.frontmatter;
        return (
          <SpecialtyWhipCard
            key={whip.title}
            isReversed={index % 2 !== 0}
            headerImage={whip.headerImage}
            description={whip.description}
            title={whip.title}
            image={whip.images[0]}
            slug={specialtyWhip.node.fields.slug}
            size="lg"
          />
        );
      })}
    </Stack>
  );
};

export default SpecialtyWhipList;
