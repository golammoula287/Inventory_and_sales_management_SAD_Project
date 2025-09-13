// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const connectDB = require('./config/database');

// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
// const supplierRoutes = require('./routes/supplierRoutes');
// const purchaseRoutes = require('./routes/purchaseRoutes');
// const salesRoutes = require('./routes/salesRoutes');
// const expenseRoutes = require('./routes/expenseRoutes');
// const damageRoutes = require('./routes/damageRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');
// const godownRoutes = require('./routes/godownRoutes');
// const vehicleRoutes = require('./routes/vehicleRoutes');
// const dashboardRoutes = require('./routes/dashboardRoutes');
// const reportRoutes = require('./routes/reportRoutes');


// dotenv.config();

// const app = express();


// connectDB();


// app.use(express.json());
// app.use(cookieParser());


// // app.use(cors({
// //   origin: ["http://localhost:5173", "http://127.0.0.1:5173"], 
// //   credentials: true 
// // }));
// // ✅ Fix CORS properly
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

// // ✅ Add this block right after cors()
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/suppliers', supplierRoutes);
// app.use('/api/purchases', purchaseRoutes);
// app.use('/api/sales', salesRoutes);
// app.use('/api/expenses', expenseRoutes);
// app.use('/api/damages', damageRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/godowns', godownRoutes);
// app.use('/api/vehicles', vehicleRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/reports', reportRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

// Routes
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
const stockRoutes = require('./routes/stockRoutes');

dotenv.config();
const app = express();

// Connect to DB
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ CORS config
const corsOptions = {
  origin: "http://localhost:5173", // frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Disposition"], // 👈 needed for PDF downloads
  credentials: true,
};

// Apply CORS globally
app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', salesRoutes); // includes /:id/invoice
app.use('/api/expenses', expenseRoutes);
app.use('/api/damages', damageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/godowns', godownRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/stock', stockRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
