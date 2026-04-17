import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import CategoryPage from '@/pages/CategoryPage';
import CommandPage from '@/pages/CommandPage';
import VimPage from '@/pages/VimPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:groupId" element={<CategoryPage />} />
        <Route path="/command/:commandId" element={<CommandPage />} />
        <Route path="/vim" element={<VimPage />} />
      </Routes>
    </BrowserRouter>
  );
}
