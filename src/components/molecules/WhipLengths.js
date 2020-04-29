import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroup, Radio } from '@chakra-ui/core';

export const whipLengths = [
  {
    name: '4 Feet',
    price: 204,
    waxedPrice: 224,
  },
  {
    name: '5 Feet',
    price: 234,
    waxedPrice: 254,
  },
  {
    name: '6 Feet',
    price: 264,
    waxedPrice: 289,
  },
  {
    name: '7 Feet',
    price: 299,
    waxedPrice: 324,
  },
  {
    name: '8 Feet',
    price: 334,
    waxedPrice: 359,
  },
  {
    name: '10 Feet',
    price: 464,
    waxedPrice: 494,
  },
  {
    name: '12 Feet',
    price: 574,
    waxedPrice: 604,
  },
];

const WhipLengths = ({ onChange, value, waxed }) => (
  <RadioGroup value={value} onChange={onChange}>
    {whipLengths.map(l => (
      <Radio value={l.name} key={l.name}>{`${l.name} ($${
        waxed ? l.waxedPrice : l.price
      })`}</Radio>
    ))}
  </RadioGroup>
);

WhipLengths.propTypes = {
  waxed: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default WhipLengths;
