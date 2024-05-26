//page created for the HomePage

// In Home.tsx

import React from 'react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

//shows all posts and includes dropdown menu for accessing different areas of the website
const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleCreatePostClick = () => {
    navigate('/createPost'); 
    console.log("Navigating to Create Post");
  };
  const handleProfileClick = () => {
    navigate('/profile'); 
    console.log("Navigating to profile");
  };


  return (
    <div>
       {/* Additional content for the Home page can be added here */}
      <Button mt={4} colorScheme="teal" onClick={handleCreatePostClick}> Create Post </Button>
      <Button mt={4} ml={2} colorScheme="teal" onClick={handleProfileClick}> Account </Button>   
    </div>
  );
};

export default Home;
