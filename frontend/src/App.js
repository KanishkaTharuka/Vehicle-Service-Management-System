import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BreakdownHome from './BreakdownServiceManagement/breakdownHome';
import BreakdownView from './BreakdownServiceManagement/breakdownview';
import BreakdownEdit from './BreakdownServiceManagement/breakdownEdit';
import BreakdownFormAdmin from './Admin/breakdownService/breakdownFormAdmin';
import BreakdownFormAdminView from './Admin/breakdownService/breakdownFormAdminView';
import Home from './home/homepage';
import './index.css';

import MainContent from './Admin/AdminDashboard/MainContent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<BreakdownHome />} /> 
        <Route path="/breakdown" element={<BreakdownView />} />
        <Route path="/breakdownedit/:id" element={<BreakdownEdit />} />
        <Route path="/admin/breakdown-form-admin" element={<BreakdownFormAdmin />} />
        <Route path="/admin/breakdown-form-admin-view" element={<BreakdownFormAdminView />} />

        {/* admin */}
        
        <Route path="/admin/mainContent" element={<MainContent />} />
      </Routes>
    </Router>
  );
}

export default App;