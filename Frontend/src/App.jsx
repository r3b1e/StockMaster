import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppSidebar from './Components/AppSidebar';
import Dashboard from './Components/Dashboard'
import Products from './Components/Products'
import Receipts from './Components/Receipts'
import Deliveries from './Components/Deliveries'
import Transfers from './Components/Transfers'
import Adjustments from './Components/Adjustments'
import History from './Components/History'
import Settings from './Components/Settings';

function App() {
  const [count, setCount] = useState(0)


  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <AppSidebar />
        
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/deliveries" element={<Deliveries />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/adjustments" element={<Adjustments />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}



export default App
