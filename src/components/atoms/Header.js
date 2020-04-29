import React, { useRef } from 'react';
// import PropTypes from 'prop-types';
import {
  Text,
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
} from '@chakra-ui/core';
import { FiMenu } from 'react-icons/fi';
import { Link } from 'gatsby';
import Cart from './Cart';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        py={5}
        px={5}
        position="fixed"
        top="0"
        left="0"
        right="0"
      >
        <IconButton
          icon={FiMenu}
          variant="ghost"
          ref={btnRef}
          onClick={onOpen}
        />
        <Stack isInline spacing="3" shouldWrapChildren>
          <Cart />
          <Button borderWidth="1px" as={Link} to="/design-bullwhip">
            DESIGN A BULLWHIP
          </Button>
        </Stack>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent backgroundColor="gray.900">
            <DrawerCloseButton />
            <DrawerHeader>Site Menu</DrawerHeader>
            <DrawerBody>
              <Text>hi</Text>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </>
  );
};

Header.propTypes = {};

Header.defaultProps = {};

export default Header;
