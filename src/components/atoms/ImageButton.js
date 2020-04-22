import React from 'react';
import PropTypes from 'prop-types';
import { Box, Image, Text } from '@chakra-ui/core';
import styled from '@emotion/styled';

const Container = styled(Box)`
  border-color: ${props => props.theme.colors.blue['300']};
  position: relative;
  border-radius: ${props => props.theme.radii['lg']};
`;

const Label = styled(Text)`
  font-weight: 600;
  text-align: center;
  margin-top: ${props => props.theme.space['1']};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const ImageButton = ({ name, image, isSelected, onClick }) => (
  <Container onClick={onClick} borderWidth={isSelected ? '4px' : 0}>
    <Image src={image} resize="cover" width="100%" borderRadius="md" />
    <Label>{name}</Label>
  </Container>
);

ImageButton.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

ImageButton.defaultProps = {
  isSelected: false,
};

export default ImageButton;
