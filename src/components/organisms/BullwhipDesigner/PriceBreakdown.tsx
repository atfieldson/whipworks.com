import React, { useEffect, useState } from 'react';
import { Box, Text, SimpleGrid } from '@chakra-ui/react';

import { conchos } from './constants/conchos';
import { handleLengths } from './constants/handleLengths';
import { whipLengths } from './constants/whipLengths';
import { Concho } from './ConchoPicker';
import { collars } from './constants/collars';
import { heelLoops } from './constants/heelLoops';

type Props = {
  handleLength?: string;
  whipLength?: string;
  concho?: string;
  isWaxed?: boolean;
  collar?: string;
  heelLoop?: string;
};

const PriceBreakdown = ({ handleLength, whipLength, concho, isWaxed, collar, heelLoop }: Props) => {
  const [conchoPrice, setConchoPrice] = useState<number | undefined>(undefined);
  const [handlePrice, setHandlePrice] = useState<number | undefined>(undefined);
  const [lengthPrice, setLengthPrice] = useState<number | undefined>(undefined);
  const [collarPrice, setCollarPrice] = useState<number | undefined>(undefined);
  const [heelLoopPrice, setHeelLoopPrice] = useState<number>(0);

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
      const obj = collars.filter((c) => c.name === collar)[0];
      setCollarPrice(obj.price);
    }
  }, [collar]);

  useEffect(() => {
    if (heelLoop) {
      const obj = heelLoops.filter((h) => h.name === heelLoop)[0];
      setHeelLoopPrice(obj.price);
    }
  }, [heelLoop]);

  const total =
    (conchoPrice || 0) +
    (handlePrice || 0) +
    (lengthPrice || 0) +
    (isWaxed ? 25 : 0) +
    (collarPrice || 0) +
    (heelLoopPrice || 0);
  return (
    <Box mt={4}>
      <Text fontSize="sm" mb="1" fontWeight="bold">
        Price Breakdown
      </Text>
      <SimpleGrid columns={2} fontSize="sm" maxW="250px" spacingY="1">
        <Text>Concho:</Text>
        <Text textAlign="right">${conchoPrice}</Text>
        <Text>Handle:</Text>
        <Text textAlign="right">${handlePrice}</Text>
        <Text>Waxing:</Text>
        <Text textAlign="right">${isWaxed ? 25 : 0}</Text>
        <Text>Length:</Text>
        <Text textAlign="right">${lengthPrice}</Text>
        <Text fontSize="sm">Extras</Text>
        <Text> </Text>
        <Text>Collar:</Text>
        <Text textAlign="right">${collarPrice}</Text>
        <Text>Heel Loop:</Text>
        <Text textAlign="right">${heelLoopPrice}</Text>
        <Text mt="3" fontWeight="bold">
          Total:
        </Text>
        <Text mt="3" fontWeight="bold" textAlign="right">
          {total <= 0 ? '' : `$${total}`}
        </Text>
      </SimpleGrid>
    </Box>
  );
};

export default PriceBreakdown;
