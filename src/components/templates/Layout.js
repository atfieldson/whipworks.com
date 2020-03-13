import React from 'react';
import PropTypes from 'prop-types';
import Header from '../atoms/Header';
import Content from './Content';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Content>
        <footer style={{ margin: '4rem 0 2rem 0' }}>
          © {new Date().getFullYear()}, WhipWorks
        </footer>
      </Content>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
