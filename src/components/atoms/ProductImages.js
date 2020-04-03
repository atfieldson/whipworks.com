import React from 'react';
// import PropTypes from 'prop-types';
import { Flex, Stack } from '@chakra-ui/core';
import styled from '@emotion/styled';

const FakeImage = styled(Flex)`
  background-color: tomato;
  min-height: 400px;
  margin-right: ${props => props.theme.space['2']};
`;

const SmallImage = styled(Flex)`
  height: 100px;
  width: 100px;
  background-color: tomato;
`;

const ProductImages = () => (
  <Flex flex="1" direction="column">
    <FakeImage />
    <Stack isInline mt="5" spacing="5">
      <SmallImage />
      <SmallImage />
      <SmallImage />
      <SmallImage />
    </Stack>
  </Flex>
);

ProductImages.propTypes = {};

ProductImages.defaultProps = {};

export default ProductImages;
