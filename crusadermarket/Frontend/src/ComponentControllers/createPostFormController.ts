//frontend controller for creating a post

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

//interface FormData
export interface FormData {
  title: string;
  price: string;
  category: string;
  state: string;
  payment: string[];
  media: File[];
}

//attributes for creating a post
export const useCreatePostForm = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    price: '',
    category: '',
    state: '',
    payment: [],
    media: [],
  });

  const navigate = useNavigate();
  const toast = useToast();

  //handles changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  //handles radio changes
  const handleRadioChange = (value: string) => {
    setFormData(prevState => ({ ...prevState, state: value }));
  };

  //handles checkbox changes
  const handleCheckboxChange = (values: Array<string>) => {
    setFormData(prevState => ({ ...prevState, payment: values }));
  };

  //handles file changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Convert the FileList to an array of Files
      const selectedFiles = Array.from(event.target.files);
      // Update the formData with the list of selected files
      setFormData({ ...formData, media: selectedFiles });
    }
  };
  
  //method for submitting a post, everything inside this is used for creating a post
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (formData.payment.length === 0) {
      alert('Please select at least one payment option.');
      return;
    }
  
    const formDataToSend = new FormData();

    formDataToSend.append('title', formData.title);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('state', formData.state);

      // Append each payment method
    formData.payment.forEach(paymentMethod => formDataToSend.append('payment', paymentMethod));

    // Append each file in 'media'
    formData.media.forEach((file, index) => {
      formDataToSend.append(`media`, file); // Ensure this field name matches Multer's expectation
    });
    const token = localStorage.getItem('token'); // Get the JWT from storage
    console.log('this token is ',token)
    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Ensure correct format
        },
        body: formDataToSend,
      });
      if (!response.ok) {
        //console.log("Line 87: "+response.json())
        const errorBody = await response.json();
        console.log("line 89: "+errorBody);
        throw new Error(errorBody.message || 'Failed to create the post');
      }
      console.log("line 92")
      const data = await response.json();
      toast({
        title: 'Post Created',
        description: 'Your post has been successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      console.log(data);
      // Here, you might want to clear the form or navigate the user to a different page
      
    } catch (error: unknown) {
      let errorMessage = 'Error creating post';
      if (error instanceof Error) errorMessage = error.message;
      console.error(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  //return statement for returning all necessary things that happen when creating a post
  return {
    formData,
    handleChange,
    handleRadioChange,
    handleCheckboxChange,
    handleSubmit,
    handleFileChange,
    navigate,
  };
};
