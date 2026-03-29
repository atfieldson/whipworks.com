import React from 'react';
import styled from '@emotion/styled';
import { Image, Box, BoxProps } from '@chakra-ui/react';

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
  alt?: string;
};

const FullWidthImage = ({ img, alt, ...props }: Props) => (
  <Container {...props}>
    <StyledImage src={img} alt={alt || ''} loading="lazy" />
  </Container>
);

export default FullWidthImage;
