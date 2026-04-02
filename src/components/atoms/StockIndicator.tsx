import React from 'react';
import { Text, Spinner, Flex } from '@chakra-ui/react';

interface Props {
  stock: number | null;
  isLoading: boolean;
}

const StockIndicator = ({ stock, isLoading }: Props) => {
  if (isLoading) {
    return (
      <Flex align="center" gap="2" mt="2">
        <Spinner size="xs" color="whiteAlpha.600" />
        <Text fontSize="md" color="whiteAlpha.600">
          Checking availability...
        </Text>
      </Flex>
    );
  }

  // Stock not tracked for this product/variant — show nothing
  if (stock === null || stock === undefined) return null;

  if (stock === 0) {
    return (
      <Text fontSize="md" fontWeight="bold" color="red.300" mt="2">
        Out of Stock
      </Text>
    );
  }

  if (stock <= 5) {
    return (
      <Text fontSize="md" fontWeight="bold" color="orange.300" mt="2">
        Low Stock — Only {stock} left
      </Text>
    );
  }

  return (
    <Text fontSize="md" fontWeight="bold" color="green.300" mt="2">
      In Stock
    </Text>
  );
};

export default StockIndicator;
