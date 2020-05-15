import React from 'react';
import { Box, Text } from '@chakra-ui/core';

type Props = {
  label: string;
  value?: any;
};

const CustomizationLabel = ({ label, value }: Props) => (
  <Box minH="50px">
    <Text fontSize="sm">{label}</Text>
    <Text fontWeight="bold">{value}</Text>
  </Box>
);

export default CustomizationLabel;
