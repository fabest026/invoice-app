import './App.css';
import Login from './component/login/Login';
import Register from './component/register/Register';
import Dashboard from './component/dashboard/Dashboard';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './component/dashboard/Home';
import Settings from './component/dashboard/Settings';
import Invoices from './component/dashboard/Invoices';
import NewInvoice from './component/dashboard/NewInvoice';
import InvoiceDetail from './component/dashboard/InvoiceDetail';

function App() {
  const myRouter = createBrowserRouter([
    {path:'/',Component:Login},
    {path:'/login',Component:Login},
    {path:'/register',Component:Register},
    {path:'/dashboard',Component:Dashboard,children:[
      {path:'',Component:Home},
      {path:'home',Component:Home},
      {path:'settings',Component:Settings},
      {path:'invoices',Component:Invoices},
      {path:'new-invoice',Component:NewInvoice},
      {path:'invoice-detail',Component:InvoiceDetail}
    ]}
  ])
  return (
    <div>
      <RouterProvider router={myRouter}></RouterProvider>
    </div>
  );
}

export default App;
