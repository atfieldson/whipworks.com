import React from 'react';
import { Box, SimpleGrid, Flex, Button, BoxProps } from '@chakra-ui/core';
import styled from '@emotion/styled';

const Container = styled(Box)`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  height: 400px;
`;

const Overlay = styled(Box)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0.25);
`;

const InstagramFeed = ({ ...props }: BoxProps) => (
  <Container bg="green.300" {...props}>
    <SimpleGrid columns={{ base: 2, sm: 3 }}>
      <Box bg="tomato" height="200px"></Box>
      <Box bg="tomato" height="200px"></Box>
      <Box bg="tomato" height="200px"></Box>
      <Box bg="tomato" height="200px"></Box>
      <Box bg="tomato" height="200px"></Box>
      <Box bg="tomato" height="200px"></Box>
    </SimpleGrid>
    <Overlay />
    <Flex position="absolute" bottom="5" left="0" right="0" justifyContent="center">
      <Button size="lg" bg="rgba(255,255,255,0.08)" borderColor="rgba(255,255,255,0.16)">
        Follow me on Instagram
      </Button>
    </Flex>
  </Container>
);

export default InstagramFeed;
