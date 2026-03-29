import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import ImageButton from '../../atoms/ImageButton';
import { heelLoops } from './constants/heelLoops';

type Props = {
  activeHeelLoop?: string;
  onClick: (heelLoop: string) => void;
};

const HeelLoopPicker = ({ activeHeelLoop, onClick }: Props) => (
  <SimpleGrid spacing="3" columns={{ base: 2, md: 4 }}>
    {heelLoops.map((h) => (
      <ImageButton
        key={h.name}
        src={h.img}
        alt={h.name}
        label={`${h.name} (+$${h.price})`}
        onClick={() => onClick(h.name)}
        isSelected={activeHeelLoop === h.name}
      />
    ))}
  </SimpleGrid>
);

export default HeelLoopPicker;
