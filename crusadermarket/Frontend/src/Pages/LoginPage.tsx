//login page

import { Alert, AlertIcon, Box, Button, Checkbox, Divider, Heading, Input, Link } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

//method for gathering all necessary attributes for logging in
const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null); // State to manage login error

    const isValidEmail = (input: string) => {
        // Regular expression to check if the input matches the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
    };

    //handles the login
    const handleLogin = async () => {
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            // Make a POST request to your backend server to handle login
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            // Handle successful login
            const { token } = response.data; // extract the token
            localStorage.setItem('token', token);  // Storing the token in localStorage
            console.log('Logged in successfully:', response.data);
            window.location.href = '/Home';
        } catch (error) {
            // Handle login error
            console.error('Error logging in:', error);
            setError('Invalid email or password.'); // Set error message
        }
    };

    //returns all boxes/buttons that are used when logging in 
    return (
        <Box
            maxW="400px"
            mx="auto"
            mt="20vh"
            p="6"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="lg"
        >
            <Heading mb="4" textColor="#4194F2">Crusader Market</Heading>
            <Heading mb="4" fontSize="larger">Login</Heading>
            {error && (
                <Alert status="error" mb="4">
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            <Input
                mb="4"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                mb="4"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Checkbox mb="4" isChecked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>
                Remember Me
            </Checkbox>
            <div>  </div>
            <Button mb="4" onClick={handleLogin}>Login</Button>
            <Divider mb="4" borderColor="gray.400"/>
            <Link as={RouterLink} to="/signup" color="blue.500">
                Create Account
            </Link>
        </Box>
    );
};

export default LoginPage;
