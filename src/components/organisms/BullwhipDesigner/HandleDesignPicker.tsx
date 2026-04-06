import React from 'react';
import { SimpleGrid, Text } from '@chakra-ui/react';

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

// Filter out unwanted handle patterns for Stockwhips
const stockwhipHandles = handles.filter(
  (handle) => handle.name !== 'Accent' && handle.name !== 'Web of Wyrd'
);

// Snakewhip: Herringbone is default (free), others are +$15 upcharge
// Excluded: Box, Vertical Strip, Egyptian Eye, Emerald, Accent
const snakewhipExclude = ['Box', 'Vertical Strip', 'Egyptian Eye', 'Emerald', 'Accent'];
const snakewhipBaseHandles = handles.filter(
  (handle) => !snakewhipExclude.includes(handle.name)
);
const herringboneHandle: Handle = {
  name: 'Herringbone',
  img: 'https://d3ruufruf2uqog.cloudfront.net/handleDesigns/herringbone.jpg', // placeholder
};
const snakewhipHandles: Handle[] = [herringboneHandle, ...snakewhipBaseHandles];

const getHandleList = (whipType?: string): Handle[] => {
  if (whipType === 'stockwhip') return stockwhipHandles;
  if (whipType === 'snakewhip') return snakewhipHandles;
  return handles;
};

const HandleDesignPicker = ({ activeHandle, onClick, whipType }: Props) => {
  const handleList = getHandleList(whipType);

  return (
    <SimpleGrid spacing="2" columns={3}>
      {handleList.map((h: Handle) => {
        // For snakewhips, show upcharge label on non-Herringbone designs
        const upchargeLabel =
          whipType === 'snakewhip' && h.name !== 'Herringbone'
            ? `${h.name} (+$15)`
            : h.name;

        return (
          <ImageButton
            key={h.name}
            src={h.img}
            alt={h.name}
            label={upchargeLabel}
            onClick={() => onClick(h.name)}
            isSelected={activeHandle === h.name}
          />
        );
      })}
    </SimpleGrid>
  );
};

export default HandleDesignPicker;
