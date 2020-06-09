import React from 'react';
import { SimpleGrid } from '@chakra-ui/core';

import ImageButton from '../../atoms/ImageButton';
import { stockwhipFinishes } from './constants/stockwhipFinishes';

type Props = {
  activeFinish?: string;
  onClick: (finish: string) => void;
};

export type Finish = {
  name: string;
  img: string;
  price: number;
};

const FinishPicker = ({ activeFinish, onClick }: Props) => (
  <SimpleGrid spacing="3" columns={5}>
    {stockwhipFinishes.map((c: Finish) => (
      <ImageButton
        key={c.name}
        src={c.img}
        alt={c.name}
        label={`${c.name} ($${c.price})`}
        onClick={() => onClick(c.name)}
        isSelected={activeFinish === c.name}
      />
    ))}
  </SimpleGrid>
);

export default FinishPicker;