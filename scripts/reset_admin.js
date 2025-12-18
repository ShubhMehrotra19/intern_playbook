const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Schema } = mongoose;

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/playbook';

const UserSchema = new Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema);

async function resetAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const email = 'shubh.mehrotra@scaler.com';
        const res = await User.deleteOne({ email });

        if (res.deletedCount > 0) {
            console.log(`Successfully deleted admin user: ${email}`);
            console.log('Please try logging in again. The system will recreate the admin account with valid credentials.');
        } else {
            console.log(`Admin user ${email} not found in DB. Nothing to delete.`);
        }

    } catch (error) {
        console.error('Error resetting admin:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetAdmin();
