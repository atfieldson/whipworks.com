import React, { useRef } from 'react';
import {
  Flex,
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
  MenuDivider,
  Text,
  HStack,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { Link, graphql, useStaticQuery } from 'gatsby';
import styled from '@emotion/styled';
import CartButton from '../atoms/CartButton';
import { FaChevronDown } from 'react-icons/fa';
import { StaticImage } from 'gatsby-plugin-image';

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
  &::after {
    content: '';
    position: absolute;
    bottom: -30px;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
    pointer-events: none;
  }
`;

const NavLink = styled(CLink)`
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  &:hover {
    text-decoration: none;
    opacity: 0.8;
  }
`;

const query = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { collection: { eq: "specialty" } } }
      sort: { frontmatter: { sortOrder: ASC } }
    ) {
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
  const btnRef = useRef(null);
  const data = useStaticQuery(query);

  return (
    <FullWidthContainer backgroundColor={bg}>
      <Wrapper>
        {/* Left: Logo */}
        <Link to="/">
          <StaticImage
            src="../../images/marketplace_inverted.png"
            alt="WhipWorks logo"
            height={40}
          />
        </Link>

        {/* Center: Desktop Navigation */}
        <HStack spacing="6" display={{ base: 'none', md: 'flex' }}>
          {/* Custom Whips Dropdown */}
          <Menu>
            <MenuButton
              as={Box}
              cursor="pointer"
              role="button"
              aria-label="Custom Whips menu"
              _hover={{ opacity: 0.7 }}
              transition="opacity 0.2s"
            >
              <HStack spacing="1">
                <Text fontSize="1.35rem" fontWeight="600" letterSpacing="0.05em">
                  Custom Whips
                </Text>
                <FaChevronDown size={10} />
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} to="/design-bullwhip" fontWeight="bold" color="gray.900" fontSize="1rem" _hover={{ bg: '#e8e0d8' }}>
                <Image
                  height="2rem"
                  width="2rem"
                  rounded="full"
                  src="https://d3ruufruf2uqog.cloudfront.net/thumbnails/bullwhipThumbnail.png"
                  alt="Design a Bullwhip"
                  mr="12px"
                />
                <span>Design a Bullwhip</span>
              </MenuItem>
              <MenuItem as={Link} to="/design-stockwhip" fontWeight="bold" color="gray.900" fontSize="1rem" _hover={{ bg: '#e8e0d8' }}>
                <Image
                  height="2rem"
                  width="2rem"
                  rounded="full"
                  src="https://d3ruufruf2uqog.cloudfront.net/thumbnails/stockwhipThumbnail.png"
                  alt="Design a Stockwhip"
                  mr="12px"
                />
                <span>Design a Stockwhip</span>
              </MenuItem>
            </MenuList>
          </Menu>

          {/* Specialty Whips Dropdown */}
          <Menu>
            <MenuButton
              as={Box}
              cursor="pointer"
              role="button"
              aria-label="Specialty Whips menu"
              _hover={{ opacity: 0.7 }}
              transition="opacity 0.2s"
            >
              <HStack spacing="1">
                <Text fontSize="1.35rem" fontWeight="600" letterSpacing="0.05em">
                  Specialty Whips
                </Text>
                <FaChevronDown size={10} />
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem
                as={Link}
                to="/specialty-whips"
                fontWeight="bold"
                color="gray.900"
                fontSize="1rem"
                _hover={{ bg: '#e8e0d8' }}
              >
                View All Specialty Whips
              </MenuItem>
              <MenuDivider />
              {data.allMarkdownRemark.edges.map((edge: any) => (
                <MenuItem
                  as={Link}
                  to={edge.node.fields.slug}
                  key={edge.node.frontmatter.title}
                  fontWeight="bold"
                  color="gray.900"
                  fontSize="1rem"
                  _hover={{ bg: '#e8e0d8' }}
                >
                  {edge.node.frontmatter.title}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Flat Links */}
          <NavLink as={Link} to="/accessories">
            Accessories
          </NavLink>
          <NavLink as={Link} to="/contact">
            Contact
          </NavLink>
        </HStack>

        {/* Right: Mobile hamburger + Cart */}
        <HStack spacing="3">
          <IconButton
            icon={<FiMenu />}
            ref={btnRef}
            onClick={onOpen}
            aria-label="Menu"
            variant="outline"
            borderColor="rgba(255,255,255,0.16)"
            _hover={{ bg: 'rgba(255,255,255,0.16)' }}
            _active={{ bg: 'rgba(255,255,255,0.16)' }}
            display={{ base: 'flex', md: 'none' }}
          />
          <CartButton />
        </HStack>

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
          <DrawerOverlay />
          <DrawerContent backgroundColor="#271E16">
            <DrawerCloseButton />
            <DrawerHeader>
              <Heading size="md">Menu</Heading>
            </DrawerHeader>
            <DrawerBody>
              <Heading fontSize="md" letterSpacing="wider" mt="2">
                Custom Whips
              </Heading>
              <Stack spacing="3" mt="3" ml="4">
                <CLink as={Link} to="/design-bullwhip" onClick={onClose}>
                  Design a Bullwhip
                </CLink>
                <CLink as={Link} to="/design-stockwhip" onClick={onClose}>
                  Design a Stockwhip
                </CLink>
              </Stack>

              <Heading fontSize="md" letterSpacing="wider" mt="6">
                Specialty Whips
              </Heading>
              <Stack spacing="3" mt="3" ml="4">
                <CLink as={Link} to="/specialty-whips" onClick={onClose} fontWeight="bold">
                  View All
                </CLink>
                {data.allMarkdownRemark.edges.map((edge: any) => (
                  <CLink
                    as={Link}
                    to={edge.node.fields.slug}
                    key={edge.node.frontmatter.title}
                    onClick={onClose}
                  >
                    {edge.node.frontmatter.title}
                  </CLink>
                ))}
              </Stack>

              <Heading fontSize="md" letterSpacing="wider" mt="6">
                More
              </Heading>
              <Stack spacing="3" mt="3" ml="4">
                <CLink as={Link} to="/accessories" onClick={onClose}>
                  Accessories
                </CLink>
                <CLink as={Link} to="/contact" onClick={onClose}>
                  Contact
                </CLink>
              </Stack>
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
