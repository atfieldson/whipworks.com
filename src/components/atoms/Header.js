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
} from '@chakra-ui/core';
import { FiMenu } from 'react-icons/fi';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <>
      <Flex justify="space-between" align="center" py={5} px={5}>
        <IconButton
          icon={FiMenu}
          variant="ghost"
          ref={btnRef}
          onClick={onOpen}
        />
        <Button borderWidth="1px">DESIGN A BULLWHIP</Button>
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
