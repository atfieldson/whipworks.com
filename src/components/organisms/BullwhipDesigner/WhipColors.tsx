import React from 'react';
import { SimpleGrid } from '@chakra-ui/core';

import ImageButton from '../../atoms/ImageButton';
import { spools } from './constants/spoolColors';

type Props = {
  activeColor?: string;
  onClick: (color: string) => void;
};

type Spool = {
  name: string;
  img: string;
};

const WhipColors = ({ activeColor, onClick }: Props) => (
  <SimpleGrid spacing="3" minChildWidth="100px">
    {spools.map((c: Spool) => (
      <ImageButton
        key={c.name}
        label={c.name}
        src={c.img}
        onClick={() => onClick(c.name)}
        isSelected={activeColor === c.name}
        alt={c.name}
      />
    ))}
  </SimpleGrid>
);

export default WhipColors;
