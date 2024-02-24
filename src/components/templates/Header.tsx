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
  Text,
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
  const btnRef = useRef(null);
  const data = useStaticQuery(query);

  return (
    <FullWidthContainer backgroundColor={bg}>
      <Wrapper>
        <Stack direction="row" spacing="6" shouldWrapChildren>
          <IconButton
            icon={<FiMenu />}
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
        <Link to="/">
          <StaticImage
            src="../../images/marketplace_inverted.png"
            alt="WhipWorks logo"
            height={40}
          />
        </Link>
        <Menu>
          <MenuButton
            as={Button}
            bg="gray.500"
            color="#1a140f"
            size="md"
            _hover={{ bg: 'gray.500' }}
            rightIcon={<FaChevronDown size={10} />}
          >
            Design a Whip
          </MenuButton>
          <MenuList>
            <Text textAlign="center" mt="6px" color="gray.900">
              Bullwhip or Stockwhip?
            </Text>
            <MenuItem as={Link} to="/design-bullwhip" fontWeight="bold" mt="12px" color="gray.900">
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
            <MenuItem as={Link} to="/design-stockwhip" fontWeight="bold" mt="12px" color="gray.900">
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
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
          <DrawerOverlay />
          <DrawerContent backgroundColor="#271E16">
            <DrawerCloseButton />
            <DrawerHeader>
              <Heading size="md">Menu</Heading>
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
