import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

mongoose.connect('mongodb+srv://ketut:samuraiX@cluster0.rgmxrj2.mongodb.net/pst?retryWrites=true&w=majority')
  .then(async () => {
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      role: String
    }));
    await User.create({
      email: 'coba@bps.go.id',
      password: bcrypt.hashSync('samuraiX', 10),
      role: 'admin'
    });
    console.log('User created');
    mongoose.connection.close();
  })
  .catch(err => console.error('Error:', err));