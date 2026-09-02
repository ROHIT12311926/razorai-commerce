import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';

import CartPage from './pages/CartPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;