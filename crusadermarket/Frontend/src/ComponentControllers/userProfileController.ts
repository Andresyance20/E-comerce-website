//frontend controller for creating a user account and editing a user account

import { useState, useEffect } from 'react';
import { getUserName, getUserEmail, getUserPhone, updateUserName, updateUserEmail, updateUserPhone } from '../Routing/ProfileApi';
import { useToast } from '@chakra-ui/react';

//attributes needed for creating an account
const useProfileFormLogic = () => {
    const toast = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [editMode, setEditMode] = useState(false);
    const token = localStorage.getItem('token'); // Token is stored in localStorage

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { name } = await getUserName(token);
                const { email } = await getUserEmail(token);
                const { phone } = await getUserPhone(token);
                setName(name);
                setEmail(email);
                setPhone(phone);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchData();
    }, [token]);

    //handles editing a profile
    const handleEditToggle = () => setEditMode(!editMode);

    //handles changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'profileName') setName(value);
        if (name === 'email') setEmail(value);
        if (name === 'phoneNumber') setPhone(value);
    };

    //handles changes when they're saved
    const handleSaveChanges = async () => {
      try {
          await updateUserName(name, token);
          await updateUserEmail(email, token);
          await updateUserPhone(phone, token);
          setEditMode(false); // Toggle edit mode off after updates
          toast({
              title: "Profile Updated",
              description: "Your profile has been updated successfully!",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top" // or 'bottom', 'top-right', etc.
          });
      } catch (error) {
          console.error('Error updating profile:', error);
          toast({
              title: "Failed to Update Profile",
              description: "There was a problem updating your profile.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top"
          });
      }
  };


    //return statement for returning all attributes involved in creating/editing an account
    return {
        name,
        setName,
        email,
        setEmail,
        phone,
        setPhone,
        editMode,
        handleEditToggle,
        handleChange,
        handleSaveChanges
    };
};

export default useProfileFormLogic;