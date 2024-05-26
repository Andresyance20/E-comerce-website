//page for your items you're interested in (your "buys")

// Buys.tsx
import { Box, Text, VStack, Flex, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getBuys } from '../Routing/BuysApi'; // Ensure this is imported correctly
import NavbarOther from './NavbarOther';

const baseUrl = 'http://localhost:5000/';

//Item interface
interface Item {
    _id: string;
    title: string;
    price: string;
    category: string;
    state: string;
    payment: string[];
    media: string[];
    user: { _id: string, name: string, email: string }; 
}

//method for showing your buys, shows the seller info for contact info and all info about the product
const Buys = () => {
    const [items, setItems] = useState<Item[]>([]);
    const token = localStorage.getItem('token'); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBuys(token);
                const processedData = data.map((item: Item) => ({
                    ...item,
                    media: item.media.map(url => url.replace(/\\/g, '/'))  // Ensuring paths are correct for URLs
                  }));
                setItems(processedData);
            } catch (error) {
                console.error('Failed to fetch items:', error);
            }
        };

        fetchData();
    }, [token]);

    //returns your buys
    return (
        <><NavbarOther /><Box p={5} mt="0px"> {/* Margin top to push content below the navbar */}
            <Text fontSize="2xl" mb={4}>Items I'm Interested in Buying</Text>
            <VStack spacing={4} align="stretch">
                {items.map((item: Item) => (
                    <Flex key={item._id} p="5" shadow="md" borderWidth="1px" borderRadius="lg" bg="gray.100" align="center">
                        <Image src={`${baseUrl}${item.media[0]}`} alt="Listing image" boxSize="150px" mr={4}/>
                        <Box>
                            <Text fontWeight="bold">{item.title} - ${item.price}</Text>
                            <Text>Category: {item.category}</Text>
                            <Text>Condition: {item.state}</Text>
                            <Text>Payment Options: {item.payment.join(', ')}</Text>
                            <Text>Seller: {item.user?.name ?? 'No name provided'} - {item.user?.email ?? 'No email provided'}</Text>
                        </Box>
                    </Flex>
                ))}
            </VStack>
        </Box></>
    );
};

export default Buys;
