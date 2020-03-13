import React from 'react';
import { Box, SimpleGrid, Button, Flex } from '@chakra-ui/core';
import styled from '@emotion/styled';

const Container = styled(Box)`
  height: 400px;
  background-color: orange;
  position: relative;
`;

const Overlay = styled(Box)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0.25);
`;

const InstagramFeed = ({ ...props }) => (
  <Container {...props}>
    <SimpleGrid columns={3}>
      <Box bg="tomato" height="200px"></Box>
      <Box bg="tomato" height="200px"></Box>
      <Box bg="tomato" height="200px"></Box>
      <Box bg="tomato" height="200px"></Box>
      <Box bg="tomato" height="200px"></Box>
    </SimpleGrid>
    <Overlay />
    <Flex
      position="absolute"
      bottom="5"
      left="0"
      right="0"
      justifyContent="center"
    >
      <Button size="lg"> Follow me on Instagram</Button>
    </Flex>
  </Container>
);

InstagramFeed.propTypes = {};

InstagramFeed.defaultProps = {};

export default InstagramFeed;
