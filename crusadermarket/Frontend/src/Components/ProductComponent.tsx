//frontend component for a product

// components/ProductComponent.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

//attributes for a product
interface Listing {
  _id: string;
  name: string;
  price: number;
  // Add other listing properties as needed
}

//Props interface
interface Props {
  addToCart: (listing: Listing) => void;
}

//product component method 
const ProductComponent: React.FC<Props> = ({ addToCart }) => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    fetchListings();
  }, []);

  //fethces listings
  const fetchListings = async () => {
    try {
      const response = await axios.get('/api/listings');
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  return (
    <div>
      <h1>Listings</h1>
      {listings.map((listing) => (
        <div key={listing._id}>
          <h2>{listing.name}</h2>
          <p>${listing.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductComponent;
