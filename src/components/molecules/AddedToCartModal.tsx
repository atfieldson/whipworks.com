import React from 'react';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  VStack,
  Text,
} from '@chakra-ui/react';
import { navigate } from 'gatsby';

interface AddedToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cancelRef: React.RefObject<any>;
  continuePath?: string; // undefined = stay on page, string = navigate there
}

const AddedToCartModal = ({ isOpen, onClose, cancelRef, continuePath }: AddedToCartModalProps) => {
  const handleContinueShopping = () => {
    onClose();
    if (continuePath) {
      navigate(continuePath);
    }
  };

  const handleGoToCheckout = () => {
    onClose();
    // Open Snipcart checkout
    if (typeof window !== 'undefined' && (window as any).Snipcart) {
      (window as any).Snipcart.api.theme.cart.open();
    }
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent backgroundColor="#271E16" mx="4">
          <AlertDialogHeader fontSize="xl" fontWeight="bold" textAlign="center" pt="6">
            Item Added to Cart!
          </AlertDialogHeader>
          <AlertDialogBody textAlign="center">
            <Text>What would you like to do?</Text>
          </AlertDialogBody>
          <AlertDialogFooter justifyContent="center" pb="6">
            <VStack spacing="3" width="100%">
              <Button
                onClick={handleGoToCheckout}
                width="100%"
                size="lg"
              >
                Go to Checkout
              </Button>
              <Button
                ref={cancelRef}
                onClick={handleContinueShopping}
                variant="outline"
                width="100%"
                size="lg"
                borderColor="rgba(255,255,255,0.3)"
                _hover={{ bg: 'rgba(255,255,255,0.1)' }}
              >
                Continue Shopping
              </Button>
            </VStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AddedToCartModal;
