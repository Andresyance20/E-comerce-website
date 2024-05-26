//App.tsx handles directing you to each page based on where you'd like to access on the site

import React from 'react';
import { ChakraProvider} from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import CreatePost from './Pages/createPost';
import Profile from './Pages/profile';
import Listings from './Pages/Listings';
import Sells from './Pages/Sells'; 
import Buys from './Pages/Buys'; 



const App: React.FC = () => {
    return (
        <ChakraProvider>
            <Router>
              <Routes>
                <Route path="/" Component={LoginPage} />
                <Route path="/login" Component={LoginPage} />
                <Route path="/signup" Component={SignUpPage} />
                <Route path="/createPost" element={<CreatePost />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/Home" Component={Listings} />
                <Route path="/sells" Component={Sells} />
                <Route path="/Buys" Component={Buys} />


              </Routes>
            </Router>
        </ChakraProvider>
    );
};



export default App;

