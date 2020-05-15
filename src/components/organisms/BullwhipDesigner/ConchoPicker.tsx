import React from 'react';
import { SimpleGrid } from '@chakra-ui/core';

import ImageButton from '../../atoms/ImageButton';
import { conchos } from './constants/conchos';

type Props = {
  activeConcho?: string;
  onClick: (concho: string) => void;
};

export type Concho = {
  name: string;
  img: string;
  price: number;
};

const ConchoPicker = ({ activeConcho, onClick }: Props) => (
  <SimpleGrid spacing="3" columns={4}>
    {conchos.map((c: Concho) => (
      <ImageButton
        key={c.name}
        src={c.img}
        alt={c.name}
        label={`${c.name} ($${c.price})`}
        onClick={() => onClick(c.name)}
        isSelected={activeConcho === c.name}
      />
    ))}
  </SimpleGrid>
);

export default ConchoPicker;
