import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@chakra-ui/core';
import styled from '@emotion/styled';
import Content from '../templates/Content';

const Image = styled(Box)`
  background-color: red;
  max-height: 900px;
  min-height: 300px;
  /* margin-top: -90px; */
  /* position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1; */
`;

const FullWidthImage = ({ imageHeight, offsetHeight, children, ...props }) => (
  <>
    <Image height={imageHeight} {...props}>
      <Content height="100%">{children}</Content>
    </Image>
  </>
);

FullWidthImage.propTypes = {
  imageHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  offsetHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

FullWidthImage.defaultProps = {
  imageHeight: '80vh',
  offsetHeight: '80vh',
};

export default FullWidthImage;
