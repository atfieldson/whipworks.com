import React, { useRef } from 'react';
import {
  Flex,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  Stack,
  Heading,
  Link as CLink,
  Box,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text
} from '@chakra-ui/core';
import { FiMenu } from 'react-icons/fi';
import { Link, graphql, useStaticQuery, navigate } from 'gatsby';
import styled from '@emotion/styled';
import CartButton from '../atoms/CartButton';

const Wrapper = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
`;

const FullWidthContainer = styled(Flex)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  transition: background-color 0.5s ease;
`;

const Logo = styled(Image)`
  height: 40px;
  width: auto;
  object-fit: contain;
  cursor: pointer;
`;

const query = graphql`
  query {
    allMarkdownRemark(filter: { fields: { collection: { eq: "specialty" } } }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;

const Header = ({ bg }: { bg?: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLElement | null>(null);
  const data = useStaticQuery(query);

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <FullWidthContainer backgroundColor={bg}>
      <Wrapper>
        <Stack isInline spacing="6" shouldWrapChildren>
          <IconButton
            icon={FiMenu}
            ref={btnRef}
            onClick={onOpen}
            aria-label="Menu"
            variant="outline"
            borderColor="rgba(255,255,255,0.16)"
            _hover={{ bg: 'rgba(255,255,255,0.16)' }}
            _active={{ bg: 'rgba(255,255,255,0.16)' }}
          />
          <CartButton />
        </Stack>
        <Logo src={require('../../images/marketplace_inverted.png')} onClick={handleLogoClick} />
        <Menu>
          <MenuButton as={Button} rightIcon="chevron-down">
            Design a Whip
          </MenuButton>
          <MenuList>
            <Text textAlign="center">Bullwhip or Stockwhip?</Text>
            <MenuItem as={Link} to="/design-bullwhip" fontWeight="bold">
              <Image
                size="2rem"
                rounded="full"
                src="https://d3ruufruf2uqog.cloudfront.net/thumbnails/bullwhipThumbnail.png"
                alt="Design a Bullwhip"
                mr="12px"
              />
              <span>Design a Bullwhip</span>
            </MenuItem>
            <MenuItem as={Link} to="/design-stockwhip" fontWeight="bold">
            <Image
                size="2rem"
                rounded="full"
                src="https://d3ruufruf2uqog.cloudfront.net/thumbnails/stockwhipThumbnail.png"
                alt="Design a Stockwhip"
                mr="12px"
              />
              <span>Design a Stockwhip</span>
            </MenuItem>
          </MenuList>
        </Menu>
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
          <DrawerOverlay />
          <DrawerContent backgroundColor="#271E16">
            <DrawerCloseButton />
            <DrawerHeader>
              <Heading size="md">
              Menu
              </Heading>
            </DrawerHeader>
            <DrawerBody>
              <Stack spacing="4">
                <CLink as={Link} to="/design-bullwhip">
                  Design a Bullwhip
                </CLink>
                <CLink as={Link} to="/design-stockwhip">
                  Design a Stockwhip
                </CLink>
                <CLink as={Link} to="/accessories">
                  Accessories
                </CLink>
                <CLink as={Link} to="/contact">
                  Contact Me
                </CLink>
              </Stack>
              <Heading fontSize="md" letterSpacing="wider" mt="6">
                Specialty Whips
              </Heading>
              <Box mt="1" display="grid" ml="6">
                {data.allMarkdownRemark.edges.map((edge: any) => (
                  <CLink
                    as={Link}
                    width="100%"
                    to={edge.node.fields.slug}
                    key={edge.node.frontmatter.title}
                    mt="4"
                  >
                    {edge.node.frontmatter.title}
                  </CLink>
                ))}
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Wrapper>
    </FullWidthContainer>
  );
};

Header.defaultProps = {
  bg: '#1a140f',
};

export default Header;
