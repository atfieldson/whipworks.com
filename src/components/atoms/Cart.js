import React, { useState, useRef, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import {
  IconButton,
  Box,
  Text,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/core';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const StatusIcon = styled(Box)`
  position: absolute;
  bottom: 0px;
  left: 0px;
  height: 20px;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.red['400']};
  border-radius: 10px;
`;

const Cart = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Your Cart');
  const cancelRef = useRef();

  const onClose = () => setIsOpen(false);

  const onOpen = () => {
    setTitle('Your Cart');
    setIsOpen(true);
  };

  useEffect(() => {
    setTitle('Added to Cart!');
    setIsOpen(true);
  }, [items]);

  return (
    <Box pos="relative">
      <IconButton icon={FaShoppingCart} variant="ghost" onClick={onOpen} />
      {items.length > 0 && (
        <StatusIcon>
          <Text fontWeight="bold" fontSize="sm">
            {items.length}
          </Text>
        </StatusIcon>
      )}
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogContent backgroundColor="gray.900">
            <AlertDialogHeader fontWeight="bold">{title}</AlertDialogHeader>
            <AlertDialogBody>
              {items.length > 0 ? (
                <Text>Your cart currently looks like:</Text>
              ) : (
                <Text>Your cart is empty right now.</Text>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant="outline">
                Continue Shopping
              </Button>
              <Button
                variantColor="blue"
                onClick={onClose}
                ml="3"
                isDisabled={items.length < 1}
              >
                Proceed to Checkout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

const mapStateToProps = state => ({
  items: state.cart.items,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
