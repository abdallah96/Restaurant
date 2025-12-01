// Database types matching Supabase schema
export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface DailySpecial {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  active_date: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string | null;
  delivery_zone: string | null;
  order_type: 'delivery' | 'pickup';
  payment_method: 'pay_now' | 'pay_at_arrival' | null;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_type: 'menu_item' | 'daily_special';
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
}

export interface Inventory {
  id: string;
  item_type: 'menu_item' | 'daily_special';
  item_id: string;
  item_name: string;
  current_stock: number;
  min_stock_level: number;
  last_updated: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

// Frontend types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'menu_item' | 'daily_special';
  image_url?: string | null;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}
