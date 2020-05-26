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
      <InstaImage src="https://d3ruufruf2uqog.cloudfront.net/instagram/2400x2400versions/batch1.jpg" />
      <InstaImage src="https://d3ruufruf2uqog.cloudfront.net/instagram/2400x2400versions/hanging3.jpg" />
      <InstaImage src="https://d3ruufruf2uqog.cloudfront.net/instagram/2400x2400versions/batch2.jpg" />
      <InstaImage src="https://d3ruufruf2uqog.cloudfront.net/instagram/2400x2400versions/holding1.jpg" />
      <InstaImage src="https://d3ruufruf2uqog.cloudfront.net/instagram/2400x2400versions/batch3.jpg" />
      <InstaImage src="https://d3ruufruf2uqog.cloudfront.net/instagram/2400x2400versions/hanging1.jpg" />
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
