
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import Homepage from './home/homepage';
import Navbar from './home/Header';
import Footer from './home/Footer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
       
      <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
        
          
        
      </header>
    </div>
  );
}

export default App;
