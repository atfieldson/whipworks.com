import React from 'react';
import PropTypes from 'prop-types';
import ImageButton from '../atoms/ImageButton';
import { handles } from '../../constants/handleDesigns';
import { SimpleGrid } from '@chakra-ui/core';

const WhipHandles = ({ activeHandle, onClick }) => (
  <SimpleGrid spacing="3" columns={2}>
    {handles.map(h => (
      <ImageButton
        key={h.name}
        image={h.img}
        name={h.name}
        onClick={() => onClick(h.name)}
        isSelected={activeHandle === h.name}
      />
    ))}
  </SimpleGrid>
);

WhipHandles.propTypes = {
  activeHandle: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default WhipHandles;
