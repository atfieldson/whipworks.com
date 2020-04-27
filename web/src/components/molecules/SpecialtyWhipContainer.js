import React from 'react';
import { Stack } from '@chakra-ui/core';
import SpecialtyWhipCard from '../atoms/SpecialtyWhipCard';

const specials = [
  {
    title: 'Indy',
  },
  {
    title: 'Saber',
  },
  {
    title: 'Z Whip',
  },
  {
    title: 'Catwhip',
  },
];

const SpecialtyWhipContainer = () => (
  <Stack spacing={12} shouldWrapChildren>
    {specials.map((special, index) => (
      <SpecialtyWhipCard isReversed={index % 2 !== 0} />
    ))}
  </Stack>
);

SpecialtyWhipContainer.propTypes = {};

SpecialtyWhipContainer.defaultProps = {};

export default SpecialtyWhipContainer;
