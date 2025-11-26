import bcrypt from 'bcryptjs';
import { AdminUser } from '@/types';

// Temporary in-memory admin users (replace with Supabase later)
const adminUsers: AdminUser[] = [
  {
    id: '1',
    email: 'admin@restaurant.sn',
    password_hash: bcrypt.hashSync('admin123', 10), // Change this password!
    full_name: 'Admin User',
    role: 'admin',
    created_at: new Date().toISOString(),
  },
];

export const dataStore = {
  getMenuItems: () => [],
  getDailyMenus: () => [],
  getDailyMenuByDate: (_date: string) => undefined,
  getActiveDailyMenu: () => undefined,
  addDailyMenu: (_menu: any) => null,
  updateDailyMenu: (_id: string, _u: any) => null,
  deleteDailyMenu: (_id: string) => false,
  getOrders: () => [],
  addOrder: (_order: any) => null,
  updateOrder: (_id: string, _u: any) => null,
  getAdminSettings: () => null,
  updateAdminSettings: (_u: any) => ({} as any),
  
  verifyAdmin: (email: string, password: string): boolean => {
    const user = adminUsers.find(u => u.email === email);
    if (!user) return false;
    return bcrypt.compareSync(password, user.password_hash);
  },
  
  getAdminUser: (email: string): AdminUser | undefined => {
    return adminUsers.find(u => u.email === email);
  },
};
