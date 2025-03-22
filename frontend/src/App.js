import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './BreakdownServiceManagement/breakdownHome';
import BreakdownView from './BreakdownServiceManagement/breakdownview';
import BreakdownEdit from './BreakdownServiceManagement/breakdownEdit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/breakdown" element={<BreakdownView />} />
        <Route path="/breakdownedit/:id" element={<BreakdownEdit />} />
      </Routes>
    </Router>
  );
}

export default App;