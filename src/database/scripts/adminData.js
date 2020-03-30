import dotenv from 'dotenv';
import roles from '../../utils/userRoles.utils';

dotenv.config();
const {
  SUPER_USER,
 } = roles;

const admin = {
    firstName: 'admin',
    lastName: 'admin',
    username: 'super-admin',
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
    gender: 'male',
    address: 'kigali',
    role: SUPER_USER,
    isVerified: true,  
}; 
export default admin;
