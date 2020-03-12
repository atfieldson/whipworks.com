import React from 'react';
// import { Link } from 'gatsby';
import { Text, Heading, Flex } from '@chakra-ui/core';

import Layout from '../components/templates/Layout';
import SEO from '../components/seo';
import Hero from '../components/atoms/FullWidthImage';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Hero pt="80px">
      <Flex
        flex="1"
        direction="column"
        justifyContent="flex-end"
        height="100%"
        pb="20"
      >
        <Heading fontSize="4rem">WhipWorks</Heading>
        <Text fontSize="lg" ml="5px">
          Custom homemade whips!
        </Text>
      </Flex>
    </Hero>
  </Layout>
);

export default IndexPage;
