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
        <footer style={{ marginTop: '20px' }}>
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
