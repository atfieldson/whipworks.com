import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@chakra-ui/core';
import styled from '@emotion/styled';
import Header from '../atoms/Header';

const Content = styled(Box)`
  margin: 0 auto;
  padding: '0';
  max-width: ${props => props.theme.maxContentWidth};
`;

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Content>
        <main>{children}</main>
        <footer>© {new Date().getFullYear()}, WhipWorks</footer>
      </Content>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
