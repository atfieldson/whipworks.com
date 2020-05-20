import React, { useState } from 'react';
import { Box, Heading, Text, Stack, Flex, Image } from '@chakra-ui/core';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import SpecialtyWhipList from '../components/organisms/SpecialtyWhipList';
import InstagramFeed from '../components/organisms/InstagramFeed';
import styled from '@emotion/styled';
import useDocumentScrollThrottled, { ScrollData } from '../../useDocumentScroll';

const HeroImage = styled(Box)`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  height: 80vh;
  min-height: 500px;
  background-image: url("https://whipworks.s3.us-east-2.amazonaws.com/bannerImages/FB+Banner.jpg");
  background-size: auto 80vh;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #1a140f;
`;

const MINIMUM_SCROLL = 350;

const Index = () => {
  const [showHeader, setShowHeader] = useState(false);

  useDocumentScrollThrottled((callbackData: ScrollData) => {
    const { currentScrollTop } = callbackData;
    const isMinimumScrolled = currentScrollTop > MINIMUM_SCROLL;

    setTimeout(() => {
      setShowHeader(isMinimumScrolled);
    }, 200);
  });

  return (
    <Layout headerBackground={showHeader ? undefined : 'transparent'}>
      <SEO title="Home" />
      <HeroImage mb="24" mt="-100px" />
      <SpecialtyWhipList />
      <InstagramFeed my="24" />
      <Box mb="12">
        <Heading>What goes in to a WhipWorks bullwhip?</Heading>
        <Text>Description here.</Text>
      </Box>
      <Stack spacing="12" mb="24">
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
    </Layout>
  );
};

export default Index;
