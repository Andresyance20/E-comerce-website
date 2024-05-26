//other navbar page

import { ChevronDownIcon } from '@chakra-ui/icons'; // This is Chakra UI's built-in icon. Replace with your custom icon if needed.
import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { Link, useNavigate, } from 'react-router-dom'; // Import useHistory hook
import logo from '../OurLogo.webp'; // Adjust the path according to where you placed it



//method for all things included on this page
const NavbarOther = () => {
  const nav = useNavigate(); // Initialize useHistory hook

  //handles logging out
  const handleLogout = () => {
    // Clear session/local storage
    localStorage.removeItem('token'); // accessToken is used for authentication
    // Redirect to login page
    nav('/login')
  };

  //returns menu buttons and logo button
  return (
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

      {/* Right side - Profile Button, Create Post Button, and Logout Button */}
      <Flex align="center">
       {/* Dropdown Menu */}
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal">
          Menu {/* Replace `your-icon-name` with your icon if custom */}
        </MenuButton>
        <MenuList backgroundColor={"teal"} >
          <MenuItem as={Link} to="/profile" mr={4} backgroundColor={"teal"} _focus={{  bg: "teal.700",backgroundColor:"blue.500"}}>Profile </MenuItem> 
          <MenuItem as={Link} to="/Sells" mr={4} backgroundColor={"teal"} _focus={{  bg: "teal.700",backgroundColor:"blue.500"}}>My Listings </MenuItem> 
          <MenuItem as={Link} to="/Buys" mr={4} backgroundColor={"teal"} _focus={{  bg: "teal.700",backgroundColor:"blue.500"}}>My Orders</MenuItem> 
          <MenuItem as={Link} to="/createpost" mr={4} backgroundColor={"teal"}  _focus={{  bg: "teal.700",backgroundColor:"blue.500"}} >Create Post</MenuItem >
          <MenuItem onClick={handleLogout} backgroundColor={"teal"} _focus={{  bg: "teal.700",backgroundColor:"blue.500"}}>Log Out</MenuItem> 
        </MenuList>
      </Menu>
      </Flex> 
    </Flex>
  );
};



export default NavbarOther;
