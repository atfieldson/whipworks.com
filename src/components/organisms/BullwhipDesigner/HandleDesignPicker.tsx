import React from 'react';
import { SimpleGrid } from '@chakra-ui/core';

import ImageButton from '../../atoms/ImageButton';
import { handles } from './constants/handleDesigns';

type Props = {
  activeHandle?: string;
  onClick: (design: string) => void;
};

type Handle = {
  name: string;
  img: string;
};

const HandleDesignPicker = ({ activeHandle, onClick }: Props) => (
  <SimpleGrid spacing="3" columns={2}>
    {handles.map((h: Handle) => (
      <ImageButton
        key={h.name}
        src={h.img}
        alt={h.name}
        label={h.name}
        onClick={() => onClick(h.name)}
        isSelected={activeHandle === h.name}
      />
    ))}
  </SimpleGrid>
);

export default HandleDesignPicker;
