import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BreakdownHome from './BreakdownServiceManagement/breakdownHome';
import BreakdownView from './BreakdownServiceManagement/breakdownview';
import BreakdownEdit from './BreakdownServiceManagement/breakdownEdit';
import BreakdownFormAdmin from './Admin/breakdownService/breakdownFormAdmin';
import BreakdownFormAdminView from './Admin/breakdownService/breakdownFormAdminView';
import Home from './home/homepage';
import './index.css';
//janith
import FinancexpencesView from './Admin/Finace/FinancexpencesView';
import FinanceExpensesForm from './Admin/Finace/Financexpencesform';
import FinancexpenceUpdate from './Admin/Finace/FinancexpenceUpdate'; 
import AcceptedBreakdowns from './Admin/Finace/AcceptedBreakdowns';
import AllIncomeExpensesView from './Admin/Finace/AllIncomeExpensesView';
import AllEmployeeView from './Admin/Finace/AllEmployeeView';
import AllAppointmentsView from './Admin/Finace/AllAppointmentsView';
import FinaceIncomeForm from './Admin/Finace/incomeview';
// import MainContent from './Admin/AdminDashboard/MainContent';
import FinanceIncomeUpdate from './Admin/Finace/FinancIncomeUpdate';

import MainContent from './Admin/AdminDashboard/MainContent';

// pawan
import CategoryManagement from './Admin/Salesmanager/CategoryManagement';
import ItemManagement from './Admin/Salesmanager/ItemManagement';
import ItemBrowser from './SalesManagement/components/ItemBrowser';
import Cart from './SalesManagement/components/Cart';
import Checkout from './SalesManagement/components/Checkout';
import Orderonfirmation from './SalesManagement/components/OrderConfirmation'
import Category from './SalesManagement/components/Category';

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

         {/* janith */}
                    <Route path="/appointments" element={<AllAppointmentsView />} />
                    <Route path="/allemployees" element={<AllEmployeeView />} />
                    <Route path="/acceptedbreakdowns" element={<AcceptedBreakdowns />} />
                    <Route path="/admin/allincomeexpenses" element={<AllIncomeExpensesView />} />
                    <Route path="/expenses" element={<FinancexpencesView />} />
                    <Route path="/formExpense" element={<FinanceExpensesForm />} /> {}
                    <Route path="/updateExpense/:id" element={<FinancexpenceUpdate />} /> {}
                    <Route path="/updateIncome/:id" element={<FinanceIncomeUpdate />} /> {}
                    <Route path="/income" element={<FinaceIncomeForm />} />

        {/* pawan */}

        <Route path="/category" element={<CategoryManagement/>}/>
        <Route path="/items" element={<ItemManagement/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/itemBrowser" element={<ItemBrowser/>}/>
        <Route path="/order-confirmation" element={<Orderonfirmation/>}/>
        <Route path="/cate" element={<Category />}/>
      </Routes>
    </Router>
  );
}

export default App;