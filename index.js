const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });


const authRoutes = require('./routes/auth');

// Ensure this is at the top

const app = express();
app.use(express.json());
app.use(cors());




// Check if MONGO_URI is loaded
console.log('Mongo URI:', process.env.MONGO_URI ? 'Loaded' : 'Not Loaded');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.log('❌ MongoDB connection error:', err));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/auth');

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Check if MONGO_URI is loaded
// console.log('Mongo URI:', process.env.MONGO_URI ? 'Loaded' : 'Not Loaded');

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('✅ MongoDB connected'))
//     .catch((err) => console.log('❌ MongoDB connection error:', err));

// app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
