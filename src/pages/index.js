import React from 'react';
// import { Link } from 'gatsby';
import { Text, Heading } from '@chakra-ui/core';

import Layout from '../components/templates/Layout';
import SEO from '../components/seo';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Text>This is a test!</Text>
    <Heading>Boop</Heading>
  </Layout>
);

export default IndexPage;
