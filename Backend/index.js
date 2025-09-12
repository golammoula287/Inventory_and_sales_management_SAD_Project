const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const salesRoutes = require('./routes/salesRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const damageRoutes = require('./routes/damageRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const godownRoutes = require('./routes/godownRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');


dotenv.config();

const app = express();


connectDB();


app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], 
  credentials: true 
}));


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/damages', damageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/godowns', godownRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//  After Creating the frontend We can Use The above Code 



// const express = require('express');
// const dotenv = require('dotenv');
// const cookieParser = require('cookie-parser');
// const connectDB = require('./config/database');

// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
// const supplierRoutes = require('./routes/supplierRoutes');
// const purchaseRoutes = require('./routes/purchaseRoutes');
// const salesRoutes = require('./routes/salesRoutes');
// const expenseRoutes = require('./routes/expenseRoutes');
// const damageRoutes = require('./routes/damageRoutes');

// dotenv.config();

// const app = express();


// connectDB();


// app.use(express.json());
// app.use(cookieParser());


// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/suppliers', supplierRoutes);
// app.use('/api/purchases', purchaseRoutes);
// app.use('/api/sales', salesRoutes);
// app.use('/api/expenses', expenseRoutes);
// app.use('/api/damages', damageRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
