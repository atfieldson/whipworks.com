import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';

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
  <SimpleGrid spacing="2" minChildWidth={['45px', '70px']}>
    {spools.map((c: Spool) => (
      <ImageButton
        key={c.name}
        label={c.name}
        src={c.img}
        onClick={() => onClick(c.name)}
        isSelected={activeColor === c.name}
        alt={c.name}
        maxH="70px"
      />
    ))}
  </SimpleGrid>
);

export default WhipColors;
