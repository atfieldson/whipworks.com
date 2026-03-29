import React, { useEffect, useState } from 'react';
import { Box, Text, SimpleGrid } from '@chakra-ui/react';

import { conchos } from './constants/conchos';
import { stockwhipHandleLengths } from './constants/stockwhipHandleLengths';
import { thongLengths } from './constants/thongLengths';
import { Concho } from './ConchoPicker';
import { heelLoops } from './constants/heelLoops';

type Props = {
  stockwhipHandleLength?: string;
  thongLength?: string;
  concho?: string;
  isWaxed?: boolean;
  heelLoop?: string;
};

const PriceBreakdownStockwhip = ({
  stockwhipHandleLength,
  thongLength,
  concho,
  isWaxed,
  heelLoop,
}: Props) => {
  const [conchoPrice, setConchoPrice] = useState<number | undefined>(undefined);
  const [handlePrice, setHandlePrice] = useState<number | undefined>(undefined);
  const [thongPrice, setThongPrice] = useState<number | undefined>(undefined);
  const [heelLoopPrice, setHeelLoopPrice] = useState<number>(0);

  useEffect(() => {
    if (concho) {
      const obj = conchos.filter((c: Concho) => c.name === concho)[0];
      setConchoPrice(obj.price);
    }
  }, [concho]);

  useEffect(() => {
    if (stockwhipHandleLength) {
      const obj = stockwhipHandleLengths.filter((h) => h.name === stockwhipHandleLength)[0];
      setHandlePrice(obj.price);
    }
  }, [stockwhipHandleLength]);

  useEffect(() => {
    if (thongLength) {
      const obj = thongLengths.filter((w) => w.name === thongLength)[0];
      setThongPrice(obj.price);
    }
  }, [thongLength]);

  useEffect(() => {
    if (heelLoop) {
      const obj = heelLoops.filter((h) => h.name === heelLoop)[0];
      setHeelLoopPrice(obj.price);
    }
  }, [heelLoop]);

  const total =
    (conchoPrice || 0) +
    (handlePrice || 0) +
    (thongPrice || 0) +
    (isWaxed ? 25 : 0) +
    (heelLoopPrice || 0);
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
        <Text>Thong:</Text>
        <Text>${thongPrice}</Text>
        <Text fontSize="sm">Extras</Text>
        <Text> </Text>
        <Text>Heel Loop:</Text>
        <Text>${heelLoopPrice}</Text>
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

export default PriceBreakdownStockwhip;
