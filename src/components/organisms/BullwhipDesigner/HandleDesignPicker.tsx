import React from 'react';
import { SimpleGrid } from '@chakra-ui/core';

import ImageButton from '../../atoms/ImageButton';
import { handles } from './constants/handleDesigns';

type Props = {
  activeHandle?: string;
  onClick: (design: string) => void;
  whipType?: string;
};

type Handle = {
  name: string;
  img: string;
};

//Filter out unwanted handle patterns for Stockwhips
const stockwhipHandles =  handles.filter(handle => handle.name !== 'Accent' && handle.name !== 'Web of Wyrd')

const HandleDesignPicker = ({ activeHandle, onClick, whipType }: Props) => (

  <SimpleGrid spacing="3" columns={2}>
    {whipType === 'stockwhip' ? 
      stockwhipHandles.map((h: Handle) => (
      <ImageButton
        key={h.name}
        src={h.img}
        alt={h.name}
        label={h.name}
        onClick={() => onClick(h.name)}
        isSelected={activeHandle === h.name}
      />
    ))
    :
    handles.map((h: Handle) => (
      <ImageButton
        key={h.name}
        src={h.img}
        alt={h.name}
        label={h.name}
        onClick={() => onClick(h.name)}
        isSelected={activeHandle === h.name}
      />
    ))
    }
  </SimpleGrid>
);

export default HandleDesignPicker;
