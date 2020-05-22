import React from 'react';
import { Box, IconButton, Text } from '@chakra-ui/core';
import { FaShoppingCart } from 'react-icons/fa';
import styled from '@emotion/styled';

const StatusIcon = styled(Box)`
  position: absolute;
  bottom: 0px;
  left: 0px;
  height: 20px;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.red['400']};
  border-radius: 10px;
`;

const CartButton = () => (
  <Box pos="relative">
    <IconButton
      icon={FaShoppingCart}
      variant="ghost"
      aria-label="Your Cart"
      className="snipcart-checkout"
      _hover={{ bg: 'rgba(255,255,255,0.16)' }}
      _active={{ bg: 'rgba(255,255,255,0.16)' }}
    />
    <StatusIcon>
      <Text className="snipcart-items-count" fontWeight="bold" fontSize="sm"></Text>
    </StatusIcon>
  </Box>
);

export default CartButton;
