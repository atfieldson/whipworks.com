import React from 'react';
import PropTypes from 'prop-types';
import { SimpleGrid } from '@chakra-ui/core';
import ImageButton from '../atoms/ImageButton';

import { conchos } from '../../constants/conchos';

const WhipConchos = ({ activeConcho, onClick }) => (
  <SimpleGrid spacing="3" columns={4}>
    {conchos.map(c => (
      <ImageButton
        key={c.name}
        name={`${c.name} ($${c.price})`}
        image={c.img}
        onClick={() => onClick(c.name)}
        isSelected={activeConcho === c.name}
      />
    ))}
  </SimpleGrid>
);

WhipConchos.propTypes = {
  activeConcho: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

WhipConchos.defaultProps = {};

export default WhipConchos;
