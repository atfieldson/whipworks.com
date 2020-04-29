import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Text, SimpleGrid } from '@chakra-ui/core';

import { conchos } from '../../constants/conchos';
import { handleLengths } from './WhipHandleLengths';
import { whipLengths } from './WhipLengths';

const PriceBreakdown = ({ handleLength, whipLength, concho, isWaxed }) => {
  const [conchoPrice, setConchoPrice] = useState(undefined);
  const [handlePrice, setHandlePrice] = useState(undefined);
  const [lengthPrice, setLengthPrice] = useState(undefined);

  useEffect(() => {
    if (concho) {
      const obj = conchos.filter(c => c.name === concho)[0];
      setConchoPrice(obj.price);
    }
  }, [concho]);

  useEffect(() => {
    if (handleLength) {
      const obj = handleLengths.filter(h => h.name === handleLength)[0];
      setHandlePrice(obj.price);
    }
  }, [handleLength]);

  useEffect(() => {
    if (whipLength) {
      const obj = whipLengths.filter(w => w.name === whipLength)[0];
      setLengthPrice(isWaxed ? obj.waxedPrice : obj.price);
    }
  }, [whipLength]);

  const total = conchoPrice + handlePrice + lengthPrice;
  return (
    <Box mt={4}>
      <Text fontSize="sm" mb="1">
        Price Breakdown
      </Text>
      <SimpleGrid columns={2}>
        <Text>Concho:</Text>
        <Text>${conchoPrice}</Text>
        <Text>Handle Length:</Text>
        <Text>${handlePrice}</Text>
        <Text>Whip Length:</Text>
        <Text>${lengthPrice}</Text>
        <Text mt="3" fontWeight="bold">
          Total:
        </Text>
        <Text mt="3" fontWeight="bold">
          {isNaN(total) ? '' : `$${total}`}
        </Text>
      </SimpleGrid>
    </Box>
  );
};

PriceBreakdown.propTypes = {
  handleLength: PropTypes.string,
  whipLength: PropTypes.string,
  concho: PropTypes.string,
  isWaxed: PropTypes.bool,
};

export default PriceBreakdown;
