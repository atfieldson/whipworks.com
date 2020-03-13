import React from 'react';
// import { Link } from 'gatsby';
import { Text, Heading, Flex, Box, Image, Stack } from '@chakra-ui/core';

import Layout from '../components/templates/Layout';
import SEO from '../components/seo';
import Hero from '../components/atoms/FullWidthImage';
import Content from '../components/templates/Content';
import SpecialtyWhipContainer from '../components/molecules/SpecialtyWhipContainer';

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
    <Content>
      <Box my="12">
        <Heading>Specialty Whips</Heading>
        <Text>Description goes here</Text>
      </Box>
      <SpecialtyWhipContainer />
      <Box my="12">
        <Heading>What goes in to a WhipWorks bullwhip?</Heading>
        <Text>Description here.</Text>
      </Box>
      <Stack spacing="12">
        <Flex>
          <Image height="200px" width="300px" mr="5" />
          <Text>Something something here.</Text>
        </Flex>
        <Flex>
          <Image height="200px" width="300px" mr="5" />
          <Text>Something something here.</Text>
        </Flex>
        <Flex>
          <Image height="200px" width="300px" mr="5" />
          <Text>Something something here.</Text>
        </Flex>
      </Stack>
    </Content>
  </Layout>
);

export default IndexPage;
