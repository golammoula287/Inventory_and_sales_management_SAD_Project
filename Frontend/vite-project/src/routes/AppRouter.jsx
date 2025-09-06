import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import NotFound from '../pages/NotFound.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import ProductPage from '../pages/ProductPage.jsx';
import CategoryPage from '../pages/CategoryPage.jsx';
import Layout from '../components/Layout.jsx';
import PurchasePage from '../pages/PurchasePage.jsx';
import Suppliers from '../pages/SupplierPage.jsx';
import SalesPage from '../pages/SalesPage.jsx';
import ExpensePage from '../pages/ExpensePage.jsx';


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/purchases" element={<PurchasePage />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/expenses" element={<ExpensePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
