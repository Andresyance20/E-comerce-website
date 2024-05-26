//shows items your selling (your "sells")

// Sells.tsx
import { Box, Flex, Text, VStack, Image, useToast, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getSells } from '../Routing/SellsApi'; // Adjust the path as necessary
import NavbarOther from './NavbarOther';

const baseUrl = 'http://localhost:5000/';

//Buyer interface
interface Buyer {
    _id: string;
    name: string;
    email: string; 
    phone: string; // Include any other fields as necessary
}

//Item interface
interface Item {
    _id: string;
    title: string;
    price: string;
    category: string;
    state: string;
    payment: string[];
    interestedBuyers: Buyer[];  // Array of interested buyers
    media: string[];
    user: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

//method for gathering all your sells
const Sells = () => {
    const [items, setItems] = useState([]);
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    const toast = useToast();


    //fetches data for your sells
    const fetchData = async () => {
        try {
            const data = await getSells(token);
            const processedData = data.map((item: Item) => ({
                ...item,
                media: item.media.map(url => url.replace(/\\/g, '/'))  // Ensuring paths are correct for URLs
                }));

            setItems(processedData);
        } catch (error) {
            console.error('Failed to fetch items:', error);
        }
    };

    useEffect(() => {
        fetchData();
      });
    

    //handles deleting your sells
    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
      
            if (!response.ok) {
              throw new Error('Failed to delete the item');
            }
      
            toast({
              title: 'Item Deleted Succesfully',
              //description: `You successfully bought ${selectedListing?.title}`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            fetchData();
        } catch (error : any) {
            console.error('Delete Item error:', error.message);
            toast({
                title: 'Error',
                description: 'Failed to delete the item',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }

    //returns your sells along with each attribute included in those sells
    return (
        <Box>
            <NavbarOther/>
            <Box p={5} mt="80px"> {/* Adjusted margin top for better spacing below the navbar */}
                <Text fontSize="2xl" mb={4}>Items I'm Selling</Text>
                <VStack spacing={4} align="stretch">
                    {items.map((item: Item) => (
                        <Flex key={item._id} p="5" shadow="md" borderWidth="1px" borderRadius="lg" bg="gray.100" align="center" justify="space-between">
                            <Flex align="center">
                                <Image src={`${baseUrl}${item.media[0]}`} alt="Listing image" boxSize="150px" mr={4}/>
                                <Box>
                                    <Text fontWeight="bold">{item.title} - ${item.price}</Text>
                                    <Text>Category: {item.category}</Text>
                                    <Text>Condition: {item.state}</Text>
                                    <Text>Payment Options: {item.payment.join(', ')}</Text>
                                    <Text fontWeight="Bold" >Interested Buyers:</Text>
                                    {item.interestedBuyers.map(buyer => (
                                        <Text key={buyer._id}>{buyer.name} ({buyer.email}) ({buyer.phone})</Text>
                                    ))}
                                </Box>
                            </Flex>
                            <Button colorScheme="red" onClick={() => handleDelete(item._id)}>Delete</Button>
                        </Flex>
                    ))}
                </VStack>
            </Box>
        </Box>
    );
};



export default Sells;
