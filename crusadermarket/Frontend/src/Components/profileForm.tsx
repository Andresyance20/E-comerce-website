//frontend component for editing a profile

import { Box, Button, FormControl, FormLabel, Input,Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import useProfileFormLogic from '../ComponentControllers/userProfileController';

//all attributes needed for editing a profile
const ProfileForm = () => {
    const {
        name,
        email,
        phone,
        editMode,
        handleEditToggle,
        handleChange,
        handleSaveChanges
    } = useProfileFormLogic();



  //returns changes made to a user account and shows all buttons and fill in boxes used for editing the account
  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>Profile Info</Text>
      <FormControl isRequired mb={4}>
        <FormLabel>Profile Name</FormLabel>
        <Input
          name="profileName"
          value={name}
          onChange={handleChange}
          isReadOnly={!editMode}
        />
      </FormControl>

      <FormControl isRequired mb={4}>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          isReadOnly={!editMode}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Phone Number</FormLabel>
        <Input
          name="phoneNumber"
          type="tel"
          value={phone}
          onChange={handleChange}
          isReadOnly={!editMode}
        />
      </FormControl>

      {editMode ? (
        <Button colorScheme="blue" onClick={handleSaveChanges}>Save Changes</Button>
      ) : (
        <Button colorScheme="blue" onClick={handleEditToggle}>Edit Profile</Button>
      )}
      <Button colorScheme="teal" variant="solid" as={Link} to="/Home" ml={4}>
        Back to Home
      </Button>
    </Box>
  );
};

export default ProfileForm;
