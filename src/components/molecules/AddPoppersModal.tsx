import React, { useRef } from 'react';
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

const AddPoppersModal = ({ isOpen, onClose, location }: Props) => {
  const cancelRef = useRef<HTMLElement | null>(null);

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay />
      <AlertDialogContent bg="#2D231A">
        <AlertDialogHeader>Add Poppers?</AlertDialogHeader>
        <AlertDialogBody>
          Would you like to add 10 extra kevlar poppers to your order? Free shipping!
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose} className="snipcart-checkout">
            Continue to Checkout
          </Button>
          <Button
            onClick={onClose}
            className="snipcart-add-item snipcart-checkout"
            data-item-id="extra-poppers"
            data-item-price="20"
            data-item-name="10 Extra Poppers"
            data-item-description="10 extra kevlar poppers"
            data-item-url="/accessories/extra-poppers"
            data-item-image="https://d3ruufruf2uqog.cloudfront.net/accessories/extraPoppers.jpg"
            data-item-custom1-name="Color"
            data-item-custom1-options="Blue|Orange|Yellow"
            ml="4"
            bg="blue.200"
            fontWeight="bold"
            color="#1a140f"
            size="lg"
            _hover={{ backgroundColor: 'blue.600' }}
          >
            Add Poppers
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddPoppersModal;
