//frontend component for creating a post

import { Box, Button, FormControl, FormLabel, Input, Select, Radio, RadioGroup, CheckboxGroup, Checkbox, Stack, Heading } from '@chakra-ui/react';
import { useCreatePostForm } from '../ComponentControllers/createPostFormController'

//all things for creating a post
const CreatePostForm = () => {
  const {
    formData,
    handleChange,
    handleRadioChange,
    handleCheckboxChange,
    handleSubmit,
    navigate,
    handleFileChange,
  } = useCreatePostForm();

  const categories = ["all categories", "Art", "Electronics", "Property", "Jewelry", "Home Tools", "Heavy tools", "Furniture", "Sports", "Vehicles", "Other"];
  const states = ["New", "Used - Like New", "Used - Good", "Used - Acceptable"];
  const payments = ["Cash", "Accept Venmo", "To be discussed"];

  //returns all buttons and boxes that are on the create a post page
  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={6}>Create a New Post</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired mb={4}>
          <FormLabel>Title</FormLabel>
          <Input name="title" value={formData.title} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired mb={4}>
          <FormLabel>Price</FormLabel>
          <Input name="price" type="number" value={formData.price} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired mb={4}>
          <FormLabel>Category</FormLabel>
          <Select name="category" value={formData.category} onChange={handleChange}>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl as="fieldset" isRequired mb={4}>
          <FormLabel as="legend">State</FormLabel>
          <RadioGroup name="state" onChange={handleRadioChange} value={formData.state}>
            <Stack direction="row">
              {states.map(state => (
                <Radio key={state} value={state}>{state}</Radio>
              ))}
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl as="fieldset" mb={4}>
          <FormLabel as="legend">Payment Options</FormLabel>
          <CheckboxGroup value={formData.payment} onChange={handleCheckboxChange}>
            <Stack direction="row">
              {payments.map(payment => (
                <Checkbox key={payment} value={payment}>{payment}</Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </FormControl>
        
        <FormControl mb={4}>
          <FormLabel>Images 'MAX 3'</FormLabel>
            <Input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} multiple />
        </FormControl>  


        <Button mt={4} colorScheme="blue" onClick={() => navigate(-1)}>Back</Button>
        <Button mt={4} ml={2} colorScheme="blue" type="submit">Submit Post</Button>
      </form>
    </Box>
  );
};

export default CreatePostForm;
