import React from 'react';
import { Box, SimpleGrid, Flex, Button, BoxProps, Image, Link } from '@chakra-ui/core';
import styled from '@emotion/styled';

const Container = styled(Box)`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  height: 600px;
`;

const Overlay = styled(Box)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0.25);
`;

const InstaImage = styled(Image)`
  height: 300px;
  object-fit: cover;
  width: 100%;
`;

const InstagramFeed = ({ ...props }: BoxProps) => (
  <Container bg="green.300" {...props}>
    <SimpleGrid columns={{ base: 2, sm: 3 }}>
      <InstaImage src="https://d3ruufruf2uqog.cloudfront.net/instagram/371A5147%202.jpg" />
      <InstaImage src="https://d3ruufruf2uqog.cloudfront.net/instagram/732A3771%20final%202.jpg" />
      <InstaImage src="https://d3ruufruf2uqog.cloudfront.net/instagram/732A9210.jpg" />
      <InstaImage src="https://d3ruufruf2uqog.cloudfront.net/instagram/732A9746.jpg" />
      <InstaImage src="https://d3ruufruf2uqog.cloudfront.net/instagram/Batch%20(4%20of%2013).JPG" />
      <InstaImage src="https://d3ruufruf2uqog.cloudfront.net/instagram/batch02-11-2020-6.jpg" />
    </SimpleGrid>
    <Overlay />
    <Flex position="absolute" bottom="5" left="0" right="0" justifyContent="center">
      <Button
        size="lg"
        bg="blue.800"
        borderColor="rgba(255,255,255,0.16)"
        as={Link}
        href="https://www.instagram.com/whipworks/"
      >
        Follow me on Instagram
      </Button>
    </Flex>
  </Container>
);

export default InstagramFeed;
