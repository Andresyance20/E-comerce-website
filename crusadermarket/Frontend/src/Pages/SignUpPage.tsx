//signup page

import { Alert, Box, Button, Heading, Input } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';

//method for signing up, uses necessary attributes needed for signing up
const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [showAlert, setShowAlert] = useState(false); // State to manage alert visibility
    const [error, setError] = useState<string | null>(null); // State to manage form errors

    //validates email
    const validateEmail = (input: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
    };

    //validates password
    const validatePassword = (input: string) => {
        const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
        return passwordRegex.test(input);
    };

    //validates phone number
    const validatePhoneNumber = (input: string) => {
        const phoneRegex = /^\d{10}$/; // Assumes a 10-digit phone number format
        return phoneRegex.test(input);
    };

    //validates your full name
    const validateFullName = (input: string) => {
        const nameParts = input.trim().split(' ');
        return nameParts.length >= 2;
    };

    //handles the signup
    const handleSignUp = async () => {
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long and contain a special character, uppercase, lowercase, and a number.');
            return;
        }

        if (!validatePhoneNumber(phone)) {
            setError('Please enter a valid phone number.');
            return;
        }

        if (!validateFullName(name)) {
            setError('Please enter your full name with at least two strings.');
            return;
        }

        try {
            // Make a POST request to your backend server to handle signup
            await axios.post('http://localhost:5000/api/signup', { name, email, password, phone });

            // Set showAlert to true to display the alert
            setShowAlert(true);

            // After 2 seconds, reset showAlert to hide the alert
            setTimeout(() => {
                setShowAlert(false);
                // Redirect to the login page
                window.location.href = '/login';
            }, 3000);
        } catch (error) {
            console.error('Error signing up:', error);
            alert('Error signing up. Please try again.');
        }
    };

    //returns the buttons and boxes needed to signup
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
            {showAlert && ( // Render the alert conditionally based on showAlert state
                <Box mt="4">
                    <Alert status="success" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center">
                        <Heading size="md" mb="2">Account Created!</Heading>
                        <Box fontSize="sm">
                            You will now be redirected to the login page!
                        </Box>
                    </Alert>
                </Box>
            )}
            {error && ( // Render the error message if there's any
                <Alert status="error" mb="4">
                    {error}
                </Alert>
            )}
            <Heading mb="4" textColor="#4194F2">Crusader Market</Heading>
            <Heading mb="4" fontSize="larger">Sign Up</Heading>
            <Heading mb="2" fontSize="medium">Full Name</Heading>
            <Input
                mb="4"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Heading mb="2" fontSize="medium">Email</Heading>
            <Input
                mb="4"
                placeholder="Email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Heading mb="2" fontSize="medium">Password</Heading>
            <Input
                mb="4"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Heading mb="2" fontSize="medium">Phone Number</Heading>
            <Input
                mb="4"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Button onClick={handleSignUp}>Sign Up</Button>
        </Box>
    );
};

export default SignUpPage;
