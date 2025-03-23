// Homepage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header'; // Import the Header component
import Footer from './Footer'; // Import the Footer component

function Homepage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/books")
      .then((response) => {
        console.log(response.data);
        setBooks(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Header /> {/* Add Header here */}
      
      <main style={mainStyle}>
        
        
        {/* Display books once loaded */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <section style={sectionStyle}>
            <h2>add details</h2>
            <ul>
              {books.map((book) => (
                <li key={book.id}>{book.title}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
      
      <Footer /> {/* Add Footer here */}
    </div>
  );
}

const mainStyle = {
  padding: '20px',
};

const heroSectionStyle = {
  backgroundColor: '#0000FF',
  color: '#FFFFFF',
  textAlign: 'center',
  padding: '50px 20px',
};

const ctaButtonStyle = {
  backgroundColor: '#FF0000',
  color: '#FFFFFF',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const sectionStyle = {
  marginTop: '40px',
  textAlign: 'center',
};

export default Homepage;
