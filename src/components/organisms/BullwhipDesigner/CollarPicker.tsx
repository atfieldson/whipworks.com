import React from 'react';
import { SimpleGrid } from '@chakra-ui/core';

import ImageButton from '../../atoms/ImageButton';
import { collars } from './constants/collars';

type Props = {
  activeCollar?: string;
  onClick: (collar: string) => void;
};

export type Collar = {
  name: string;
  img: string;
  price: number;
};

const CollarPicker = ({ activeCollar, onClick }: Props) => (
  <SimpleGrid spacing="3" columns={5}>
    {collars.map((c: Collar) => (
      <ImageButton
        key={c.name}
        src={c.img}
        alt={c.name}
        label={`${c.name} ($${c.price})`}
        onClick={() => onClick(c.name)}
        isSelected={activeCollar === c.name}
      />
    ))}
  </SimpleGrid>
);

export default CollarPicker;
