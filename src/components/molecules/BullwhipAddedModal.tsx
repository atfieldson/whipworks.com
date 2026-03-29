import React, { useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  RadioGroup,
  Radio,
  Stack,
  Text,
  Flex,
  Box,
  Image,
} from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  location: {
    pathname: string;
  };
};

const BullwhipAddedModal = ({ isOpen, onClose, location }: Props) => {
  const cancelRef = useRef(null);
  const addPoppersRef = useRef<HTMLButtonElement>(null);
  const [popperColor, setPopperColor] = useState('Blue');

  const handleAddPoppers = () => {
    // Click the hidden snipcart button to add poppers the HTML way
    if (addPoppersRef.current) {
      addPoppersRef.current.click();
    }
    // Delay close so Snipcart can process the click before the button unmounts
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleCheckout = () => {
    onClose();
    if (typeof window !== 'undefined' && (window as any).Snipcart) {
      (window as any).Snipcart.api.theme.cart.open();
    }
  };

  return (
    <>
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay />
      <AlertDialogContent bg="#2D231A" zIndex="modal">
        <AlertDialogHeader>Whip Successfully Added to Cart</AlertDialogHeader>
        <AlertDialogBody>
          <Text mb="3">
            All WhipWorks Whips come with 5 Nylon Poppers and 3 Kevlar Poppers.
            Would you like to add 10 extra Kevlar Poppers to your order? (+$25)
          </Text>
          <Flex align="center" gap="4">
            <Box>
              <Text fontWeight="bold" mb="2">Select Popper Color:</Text>
              <RadioGroup value={popperColor} onChange={setPopperColor}>
                <Stack>
                  <Radio value="Blue">Blue</Radio>
                  <Radio value="Red">Red</Radio>
                  <Radio value="Yellow">Yellow</Radio>
                </Stack>
              </RadioGroup>
            </Box>
            <Image
              src="https://d3ruufruf2uqog.cloudfront.net/accessories/extraPoppers.jpg"
              alt="Kevlar poppers"
              maxW="200px"
              borderRadius="md"
              objectFit="cover"
            />
          </Flex>
        </AlertDialogBody>
        <AlertDialogFooter
          justifyContent="space-between"
          flexDirection={{ base: 'column', md: 'row' }}
          gap="3"
        >
          <Button
            onClick={handleAddPoppers}
            color="#000000"
            bg="rgba(255,255,255,0.9)"
            borderColor="rgba(255,255,255,0.16)"
            _hover={{ bg: 'rgba(255,255,255,1)' }}
            _active={{ bg: 'rgba(255,255,255,1)' }}
          >
            Add Poppers (+$25)
          </Button>
          <Button
            ref={cancelRef}
            onClick={handleCheckout}
            color="#000000"
            bg="rgba(255,255,255,0.9)"
            borderColor="rgba(255,255,255,0.16)"
            _hover={{ bg: 'rgba(255,255,255,1)' }}
            _active={{ bg: 'rgba(255,255,255,1)' }}
          >
            No Thanks, Checkout
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    {/* Hidden Snipcart button outside the dialog so Snipcart can find it */}
    <button
      ref={addPoppersRef}
      className="snipcart-add-item snipcart-checkout"
      data-item-id="extra-poppers"
      data-item-price="25"
      data-item-name="10 Extra Poppers"
      data-item-description="10 extra kevlar poppers"
      data-item-url="/accessories/extra-poppers"
      data-item-image="https://d3ruufruf2uqog.cloudfront.net/accessories/extraPoppers.jpg"
      data-item-custom1-name="Color"
      data-item-custom1-options="Blue[+0]|Red[+0]|Yellow[+0]"
      data-item-custom1-value={popperColor}
      tabIndex={-1}
      aria-hidden="true"
      style={{ position: 'absolute', left: '-9999px' }}
    />
    </>
  );
};

export default BullwhipAddedModal;
