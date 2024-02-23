import React, { ReactNode } from 'react';
import Content from './Content';
import styled from '@emotion/styled';
import Header from './Header';
import { Link as CLink } from '@chakra-ui/react';
import { Link } from 'gatsby';

type Props = {
  children: ReactNode;
  headerBackground?: string;
};

const Footer = styled.footer`
  height: 60px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 1080px;
  margin: 0 auto;
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
`;

const Container = styled.div`
  min-height: 100vh; /* will cover the 100% of viewport */
  overflow: hidden;
  display: block;
  position: relative;
  padding-bottom: 60px;
`;

const Layout = ({ children, headerBackground }: Props) => (
  <Container>
    <Header bg={headerBackground} />
    <Content>{children}</Content>
    <Footer>
      <CLink to="/contact" as={Link}>
        Contact
      </CLink>
      © {new Date().getFullYear()}, WhipWorks
    </Footer>
  </Container>
);

export default Layout;
