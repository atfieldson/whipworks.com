import React, { useEffect, useState } from 'react';
import { Box, Text, SimpleGrid } from '@chakra-ui/react';

import { conchos } from './constants/conchos';
import { snakewhipLengths } from './constants/snakewhipLengths';
import { Concho } from './ConchoPicker';
import { heelLoops } from './constants/heelLoops';

type Props = {
  whipLength?: string;
  concho?: string;
  isWaxed?: boolean;
  heelLoop?: string;
  handleDesignUpcharge: number;
};

const PriceBreakdownSnakewhip = ({
  whipLength,
  concho,
  isWaxed,
  heelLoop,
  handleDesignUpcharge,
}: Props) => {
  const [conchoPrice, setConchoPrice] = useState<number | undefined>(undefined);
  const [lengthPrice, setLengthPrice] = useState<number | undefined>(undefined);
  const [heelLoopPrice, setHeelLoopPrice] = useState<number>(0);

  useEffect(() => {
    if (concho) {
      const obj = conchos.filter((c: Concho) => c.name === concho)[0];
      setConchoPrice(obj.price);
    }
  }, [concho]);

  useEffect(() => {
    if (whipLength) {
      const obj = snakewhipLengths.filter((w) => w.name === whipLength)[0];
      setLengthPrice(obj.price);
    }
  }, [whipLength]);

  useEffect(() => {
    if (heelLoop) {
      const obj = heelLoops.filter((h) => h.name === heelLoop)[0];
      setHeelLoopPrice(obj.price);
    }
  }, [heelLoop]);

  const total =
    (lengthPrice || 0) +
    (conchoPrice || 0) +
    (isWaxed ? 25 : 0) +
    (heelLoopPrice || 0) +
    handleDesignUpcharge;

  return (
    <Box mt={4}>
      <Text fontSize="sm" mb="1" fontWeight="bold">
        Price Breakdown
      </Text>
      <SimpleGrid columns={2} fontSize="sm" maxW="250px" spacingY="1">
        <Text>Length:</Text>
        <Text textAlign="right">${lengthPrice}</Text>
        <Text>Handle Design:</Text>
        <Text textAlign="right">${handleDesignUpcharge}</Text>
        <Text>Concho:</Text>
        <Text textAlign="right">${conchoPrice}</Text>
        <Text>Waxing:</Text>
        <Text textAlign="right">${isWaxed ? 25 : 0}</Text>
        <Text fontSize="sm">Extras</Text>
        <Text> </Text>
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

export default PriceBreakdownSnakewhip;
