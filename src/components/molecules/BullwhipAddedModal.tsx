import React, { useRef } from 'react';
import { Link } from 'gatsby';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
 
} from '@chakra-ui/core';


type Props = {
  isOpen: boolean;
  onClose: () => void;
  location: {
    pathname: string;
  };
};

const BullwhipAddedModal = ({ isOpen, onClose, location }: Props) => {
  const cancelRef = useRef<HTMLElement | null>(null);

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay />
      <AlertDialogContent bg="#2D231A">
        <AlertDialogHeader>Whip Succesfully Added to Cart</AlertDialogHeader>
        <AlertDialogBody>
          All WhipWorks Whips come with 5 Nylon Poppers and 3 Kevlar Poppers.
          <br/>
          Would you like to add some additional Kevlar Poppers to your order?
        </AlertDialogBody>
        <AlertDialogFooter justifyContent="space-between">
          <Button
            color="#000000" 
            as={Link}
            to="/accessories/extra-poppers/"
            bg="rgba(255,255,255,0.9)"
            borderColor="rgba(255,255,255,0.16)"
            _hover={{ bg: 'rgba(255,255,255,1)' }}
            _active={{ bg: 'rgba(255,255,255,1)' }}
          >
            Add Poppers
          </Button>
          <Button 
            ref={cancelRef} 
            onClick={onClose} 
            className="snipcart-checkout" 
            color="#000000"
            bg="rgba(255,255,255,0.9)"
            borderColor="rgba(255,255,255,0.16)"
            _hover={{ bg: 'rgba(255,255,255,1)' }}
            _active={{ bg: 'rgba(255,255,255,1)' }}
          >
            Continue to Checkout
          </Button>
          
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BullwhipAddedModal;
