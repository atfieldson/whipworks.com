import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from '@chakra-ui/core';

const WhipInfo = ({ label, info }) => (
  <Box minH="50px">
    <Text fontSize="sm">{label}</Text>
    <Text fontWeight="bold">{info}</Text>
  </Box>
);

WhipInfo.propTypes = {
  label: PropTypes.string.isRequired,
  info: PropTypes.string,
};

WhipInfo.defaultProps = {};

export default WhipInfo;
