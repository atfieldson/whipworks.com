import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroup, Radio } from '@chakra-ui/core';

const handleLengths = [
  {
    name: '8 inches',
    price: 0,
  },
  {
    name: '10 inches',
    price: 5,
  },
  {
    name: '12 inches',
    price: 10,
  },
  {
    name: '14 inches',
    price: 15,
  },
];

const WhipHandleLengths = ({ onChange, value }) => (
  <RadioGroup value={value} onChange={onChange}>
    {handleLengths.map(l => (
      <Radio key={l.name} value={l.name}>{`${l.name} ($${l.price})`}</Radio>
    ))}
  </RadioGroup>
);

WhipHandleLengths.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default WhipHandleLengths;
