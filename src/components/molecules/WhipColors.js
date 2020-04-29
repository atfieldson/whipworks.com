import React from 'react';
import PropTypes from 'prop-types';
import { SimpleGrid } from '@chakra-ui/core';
import ImageButton from '../atoms/ImageButton';
import { spools } from '../../constants/spoolColors';

const WhipColors = ({ activeColor, onClick }) => (
  <SimpleGrid spacing="3" minChildWidth="100px">
    {spools.map(c => (
      <ImageButton
        key={c.name}
        name={c.name}
        image={c.img}
        onClick={() => onClick(c.name)}
        isSelected={activeColor === c.name}
      />
    ))}
  </SimpleGrid>
);

WhipColors.propTypes = {
  activeColor: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

WhipColors.defaultProps = {};

export default WhipColors;
