import mongoose from 'mongoose';

const MONGO_URI ='mongodb+srv://admin:admin@delightsense-cluster.vlnwhw4.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {});

mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});
