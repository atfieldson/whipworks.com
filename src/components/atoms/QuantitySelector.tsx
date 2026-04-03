import React from 'react';
import { Flex, Text, Button, Input } from '@chakra-ui/react';

interface Props {
  quantity: number;
  onChange: (qty: number) => void;
  max?: number;
  isOutOfStock?: boolean;
}

const QuantitySelector = ({ quantity, onChange, max, isOutOfStock }: Props) => {
  const handleDecrement = () => {
    if (quantity > 1) onChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (max && quantity >= max) return;
    onChange(quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) {
      onChange(1);
    } else if (max && val > max) {
      onChange(max);
    } else {
      onChange(val);
    }
  };

  return (
    <Flex align="center" mt="3">
      <Text fontWeight="bold" mr="3">
        Quantity
      </Text>
      <Button
        aria-label="Decrease quantity"
        size="sm"
        onClick={handleDecrement}
        isDisabled={isOutOfStock || quantity <= 1}
        variant="outline"
        borderWidth="3px"
        borderColor="whiteAlpha.400"
        color="white"
        _hover={{ bg: 'whiteAlpha.200' }}
        minW="36px"
      >
        <Text fontSize="lg">-</Text>
      </Button>
      <Input
        value={quantity}
        onChange={handleInputChange}
        isDisabled={isOutOfStock}
        size="sm"
        w="50px"
        textAlign="center"
        mx="2"
        bg={isOutOfStock ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.9)'}
        color="#000000"
        fontWeight="bold"
        borderColor="rgba(255,255,255,0.16)"
      />
      <Button
        aria-label="Increase quantity"
        size="sm"
        onClick={handleIncrement}
        isDisabled={isOutOfStock || (max !== undefined && quantity >= max)}
        variant="outline"
        borderWidth="3px"
        borderColor="whiteAlpha.400"
        color="white"
        _hover={{ bg: 'whiteAlpha.200' }}
        minW="36px"
      >
        <Text fontSize="lg">+</Text>
      </Button>
      {max !== undefined && max > 0 && (
        <Text fontSize="xs" color="whiteAlpha.600" ml="3">
          (max {max})
        </Text>
      )}
    </Flex>
  );
};

export default QuantitySelector;
