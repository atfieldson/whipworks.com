import React from 'react';
import styled from '@emotion/styled';
import { Image, Box, BoxProps } from '@chakra-ui/core';

const Container = styled(Box)`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  /* height: 80vh;
  min-height: 500px; */
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

type Props = BoxProps & {
  img: string;
};

const FullWidthImage = ({ img, ...props }: Props) => (
  <Container {...props}>
    <StyledImage src={img} />
  </Container>
);

export default FullWidthImage;
