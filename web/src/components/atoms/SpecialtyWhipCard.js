import React from 'react';
import PropTypes from 'prop-types';
import { Box, Flex, Text, Heading, Button } from '@chakra-ui/core';

const SpecialtyWhipCard = ({ isReversed }) => (
  <Flex direction={isReversed ? 'row-reverse' : 'row'}>
    <Box
      width="450px"
      height="250px"
      background="green"
      mr={isReversed ? 0 : 8}
      ml={isReversed ? 8 : 0}
    />
    <Box textAlign={isReversed ? 'right' : 'left'}>
      <Heading>A title</Heading>
      <Text>hello there</Text>
      <Button mt="6" size="lg" variantColor="blue">
        Customize
      </Button>
    </Box>
  </Flex>
);

SpecialtyWhipCard.propTypes = {
  isReversed: PropTypes.bool,
};

SpecialtyWhipCard.defaultProps = {
  isReversed: false,
};

export default SpecialtyWhipCard;
