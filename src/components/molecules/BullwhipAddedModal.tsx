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
  const addKevlarRef = useRef<HTMLButtonElement>(null);
  const addNylonRef = useRef<HTMLButtonElement>(null);
  const [popperColor, setPopperColor] = useState('Blue');
  const [popperType, setPopperType] = useState<'kevlar' | 'nylon'>('kevlar');

  const handleAddPoppers = () => {
    const ref = popperType === 'kevlar' ? addKevlarRef : addNylonRef;
    if (ref.current) {
      ref.current.click();
    }
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
      <AlertDialogContent bg="#2D231A" zIndex="modal" mx="4">
        <AlertDialogHeader>Whip Successfully Added to Cart</AlertDialogHeader>
        <AlertDialogBody>
          <Text mb="3">
            All WhipWorks Whips come with 5 Nylon Poppers and 3 Kevlar Poppers.
            Would you like to add 10 extra poppers to your order? (+$25)
          </Text>
          <RadioGroup value={popperType} onChange={(val: string) => setPopperType(val as 'kevlar' | 'nylon')}>
            <Stack spacing="4">
              <Box
                borderWidth="2px"
                borderColor={popperType === 'kevlar' ? '#5A9BBD' : 'transparent'}
                borderRadius="md"
                p="3"
                cursor="pointer"
                onClick={() => setPopperType('kevlar')}
              >
                <Radio value="kevlar" mb="2">
                  <Text fontWeight="bold">10 Kevlar Poppers — $25</Text>
                </Radio>
                <Flex align="center" gap="4" ml="6">
                  <Box>
                    <Text fontWeight="bold" mb="2" fontSize="sm">Select Color:</Text>
                    <RadioGroup value={popperColor} onChange={setPopperColor}>
                      <Stack>
                        <Radio value="Blue" size="sm">Blue</Radio>
                        <Radio value="Red" size="sm">Red</Radio>
                        <Radio value="Yellow" size="sm">Yellow</Radio>
                        <Radio value="Assorted" size="sm">Assorted</Radio>
                      </Stack>
                    </RadioGroup>
                  </Box>
                  <Image
                    src="https://d3ruufruf2uqog.cloudfront.net/accessories/kevlarPoppers/kevlarPoppers1.jpg"
                    alt="Kevlar poppers"
                    maxW="150px"
                    borderRadius="md"
                    objectFit="cover"
                  />
                </Flex>
              </Box>
              <Box
                borderWidth="2px"
                borderColor={popperType === 'nylon' ? '#5A9BBD' : 'transparent'}
                borderRadius="md"
                p="3"
                cursor="pointer"
                onClick={() => setPopperType('nylon')}
              >
                <Radio value="nylon" mb="2">
                  <Text fontWeight="bold">10 Nylon Poppers — $25</Text>
                </Radio>
                <Flex align="center" gap="4" ml="6">
                  <Image
                    src="https://d3ruufruf2uqog.cloudfront.net/accessories/nylonPoppers/nylonPoppers1.jpg"
                    alt="Nylon poppers"
                    maxW="150px"
                    borderRadius="md"
                    objectFit="cover"
                  />
                </Flex>
              </Box>
            </Stack>
          </RadioGroup>
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
    {/* Hidden Snipcart buttons outside the dialog so Snipcart can find them */}
    <button
      ref={addKevlarRef}
      className="snipcart-add-item snipcart-checkout"
      data-item-id="kevlar-poppers"
      data-item-price="25"
      data-item-name="10 Kevlar Poppers"
      data-item-description="10 extra Kevlar poppers"
      data-item-url="/accessories/extra-poppers"
      data-item-image="https://d3ruufruf2uqog.cloudfront.net/accessories/kevlarPoppers/kevlarPoppers1.jpg"
      data-item-custom1-name="Color"
      data-item-custom1-options="Blue[+0]|Red[+0]|Yellow[+0]|Assorted[+0]"
      data-item-custom1-value={popperColor}
      tabIndex={-1}
      aria-hidden="true"
      style={{ position: 'absolute', left: '-9999px' }}
    />
    <button
      ref={addNylonRef}
      className="snipcart-add-item snipcart-checkout"
      data-item-id="nylon-poppers"
      data-item-price="25"
      data-item-name="10 Nylon Poppers"
      data-item-description="10 extra Nylon poppers"
      data-item-url="/accessories/nylon-poppers"
      data-item-image="https://d3ruufruf2uqog.cloudfront.net/accessories/nylonPoppers/nylonPoppers1.jpg"
      tabIndex={-1}
      aria-hidden="true"
      style={{ position: 'absolute', left: '-9999px' }}
    />
    </>
  );
};

export default BullwhipAddedModal;
