import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Text, SimpleGrid } from '@chakra-ui/core';

import { conchos } from './constants/conchos';
import { handleLengths } from './constants/handleLengths';
import { whipLengths } from './constants/whipLengths';
import { Concho } from './ConchoPicker';
import {collars} from './constants/collars';

type Props = {
  handleLength?: string;
  whipLength?: string;
  concho?: string;
  isWaxed?: boolean;
  collar?: string;
};

const PriceBreakdown = ({ handleLength, whipLength, concho, isWaxed, collar }: Props) => {
  const [conchoPrice, setConchoPrice] = useState<number | undefined>(undefined);
  const [handlePrice, setHandlePrice] = useState<number | undefined>(undefined);
  const [lengthPrice, setLengthPrice] = useState<number | undefined>(undefined);
  const [collarPrice, setCollarPrice] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (concho) {
      const obj = conchos.filter((c: Concho) => c.name === concho)[0];
      setConchoPrice(obj.price);
    }
  }, [concho]);

  useEffect(() => {
    if (handleLength) {
      const obj = handleLengths.filter((h) => h.name === handleLength)[0];
      setHandlePrice(obj.price);
    }
  }, [handleLength]);

  useEffect(() => {
    if (whipLength) {
      const obj = whipLengths.filter((w) => w.name === whipLength)[0];
      setLengthPrice(obj.price);
    }
  }, [whipLength]);

  useEffect(() => {
    if (collar) {
      const obj = collars.filter((w) => w.name === collar)[0];
      setCollarPrice(obj.price);
    }
  }, [collar]);

  const total = (conchoPrice || 0) + (handlePrice || 0) + (lengthPrice || 0) + (isWaxed ? 25 : 0) + (collarPrice || 0);
  return (
    <Box mt={4}>
      <Text fontSize="sm" mb="1">
        Price Breakdown
      </Text>
      <SimpleGrid columns={2} fontSize="sm">
        <Text>Concho:</Text>
        <Text>${conchoPrice}</Text>
        <Text>Handle:</Text>
        <Text>${handlePrice}</Text>
        <Text>Waxing:</Text>
        <Text>${isWaxed ? 25 : 0}</Text>
        <Text>Length:</Text>
        <Text>${lengthPrice}</Text>
        <Text fontSize="sm">Extras</Text>
        <Text> </Text>
        {
        collarPrice === 0 &&
        <Text> None </Text>
        }
        {
        collarPrice === 0 &&
        <Text></Text>
        }
        <Text>{collarPrice !== 0 ? "Collar:" : ""}</Text>
        <Text>{collarPrice !== 0 ? `$${collarPrice}` : ""}</Text>
        <Text mt="3" fontWeight="bold">
          Total:
        </Text>
        <Text mt="3" fontWeight="bold">
          {total <= 0 ? '' : `$${total}`}
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
  collar: PropTypes.string,
};

export default PriceBreakdown;
