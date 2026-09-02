import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccess from './pages/OrderSuccess';
import OrderFailed from './pages/OrderFailed';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-failed" element={<OrderFailed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;