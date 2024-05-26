//listings page that shows all listings and gives menu options

import { ChevronDownIcon } from '@chakra-ui/icons'; // This is Chakra UI's built-in icon. Replace with your custom icon if needed.
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../OurLogo.webp'; // Adjust the path according to where you placed it

const baseUrl = 'http://localhost:5000/';

//Listing interface
interface Listing {
  _id: string;
  title: string;
  price: number;
  category: string;
  state: string;
  payment: string[];
  imageUrl: string;
  media: string[];
}

//method for showing everything on the listings page to give the user options on what they'd like to do
const Listings = () => {
  const [searchInput, setSearchInput] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  //fethces listings
  const fetchListings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await response.json();
      const processedData = data.map((listing: Listing) => ({
        ...listing,
        media: listing.media.map(url => url.replace(/\\/g, '/')),
      }));
      setListings(processedData);
      setFilteredListings(processedData); // Initially set filtered listings to all listings
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    // Filter listings based on search input
    const filtered = listings.filter(listing =>
      listing.title.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredListings(filtered);
  }, [searchInput, listings]);

  //handles the clicking of listing
  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
    onOpen();
  };

  //handles the clicking of the showing interest button
  const handleBuyNow = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/interest/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to buy the item');
      }

      toast({
        title: 'The seller has been notified',
        //description: `You successfully bought ${selectedListing?.title}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Refresh the listings after successful purchase
      fetchListings();
    } catch (error : any) {
      console.error('Buy Now error:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to buy the item',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };


  //handles logging out
  const handleLogout = () => {
    // Clear session/local storage
    localStorage.removeItem('token'); // accessToken is used for authentication
    // Redirect to login page
    navigate('/login');
  };

  const { colorMode } = useColorMode(); // To switch color based on browser theme

  //returns all necessary buttons from the listings page
  //not very much is commented below this because it is all logic for any button on the page
  return (
    <div>
      {/* Navbar */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        px={8}
        py={4}
        bg="blue.500"
        color="white"
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex="999"
        width="100%"
        height="70px"
      >
        {/* Left side - Logo or Brand */}
        <Box mr={4}>
          <Link to="/Home">
            <img src={logo} alt="CrusaderMarket Logo" style={{ width: '60px', height: 'auto' }} />
          </Link>
        </Box>

        {/* Middle - Search Bar */}
        <Input
          placeholder="Search..."
          variant="filled"
          size="md"
          bg="white"
          _hover={{ bg: 'white' }}
          _focus={{ bg: 'white' }}
          mr={4}
          color={colorMode === 'dark' ? 'white' : 'black'}
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />

        {/* Right side - Profile Button, Create Post Button, and Logout Button */}
        <Flex align="center">
          {/* Dropdown Menu */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal">
              Menu {}
            </MenuButton>
            <MenuList backgroundColor={'teal'}>
              <MenuItem as={Link} to="/profile" mr={4} backgroundColor={'teal'} _focus={{ bg: 'teal.700', backgroundColor: 'blue.500' }}>
                Profile
              </MenuItem>
              <MenuItem as={Link} to="/Sells" mr={4} backgroundColor={'teal'} _focus={{ bg: 'teal.700', backgroundColor: 'blue.500' }}>
                My Listings
              </MenuItem>
              <MenuItem as={Link} to="/Buys" mr={4} backgroundColor={'teal'} _focus={{ bg: 'teal.700', backgroundColor: 'blue.500' }}>
                My Orders
              </MenuItem>
              <MenuItem
                as={Link}
                to="/createpost"
                mr={4}
                backgroundColor={'teal'}
                _focus={{ bg: 'teal.700', backgroundColor: 'blue.500' }}
              >
                Create Post
              </MenuItem>
              <MenuItem onClick={handleLogout} backgroundColor={'teal'} _focus={{ bg: 'teal.700', backgroundColor: 'blue.500' }}>
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Search Bar */}
      <Box p={4} mt={16}>
        {/* Listings Grid */}
        <Heading as="h2" size="lg" mb={6}>
          Listings For You
        </Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
          {filteredListings.map((listing, index) => (
            <GridItem
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              onClick={() => handleListingClick(listing)}
              cursor="pointer"
            >
              <Image src={`${baseUrl}${listing.media[0]}` || './listingImage.png'} alt="Listing image" boxSize="250px" />
              <Box p="6">
                <Stack spacing={2}>
                  <Text fontWeight="bold">{listing.title}</Text>
                  <Text>{`$${listing.price}`}</Text>
                  <Text>{listing.category}</Text>
                  <Text>{listing.state}</Text>
                  <Text>{listing.payment.join(', ')}</Text>
                </Stack>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>

      {/* Modal for listing details */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedListing?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="row" align="center">
              <Image src={`${baseUrl}${selectedListing?.media[0]}` || './listingImage.png'} alt="Listing image" boxSize="600px" />
              <Box p={6} overflowY="auto">
                <Text fontSize="lg">{`Price: $${selectedListing?.price}`}</Text>
                <Text fontSize="lg">{`Category: ${selectedListing?.category}`}</Text>
                <Text fontSize="lg">{`State: ${selectedListing?.state}`}</Text>
                <Text fontSize="lg">{`Payment Methods: ${selectedListing?.payment.join(', ')}`}</Text>
                <Text fontSize="10">{' '}</Text>
                {selectedListing && (
                  <Button colorScheme="blue" onClick={() => handleBuyNow(selectedListing._id)}>I'm Intrested</Button>
                )}
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Listings;
