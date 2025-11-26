-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Menu Items Table (Fast Food - Regular Menu)
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Specials Table (Traditional Senegalese Meals)
CREATE TABLE IF NOT EXISTS daily_specials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  active_date DATE NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  delivery_address TEXT,
  order_type VARCHAR(50) NOT NULL, -- 'delivery' or 'pickup'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
  total_amount DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL, -- 'menu_item' or 'daily_special'
  item_id UUID NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory/Stock Management Table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_type VARCHAR(50) NOT NULL, -- 'menu_item' or 'daily_special'
  item_id UUID NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  current_stock INTEGER NOT NULL,
  min_stock_level INTEGER DEFAULT 5,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'manager',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_daily_specials_date ON daily_specials(active_date);
CREATE INDEX IF NOT EXISTS idx_daily_specials_active ON daily_specials(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_specials_updated_at BEFORE UPDATE ON daily_specials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_specials ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public can read available menu items
CREATE POLICY "Public can view available menu items" ON menu_items
  FOR SELECT USING (is_available = true);

-- Public can read active daily specials
CREATE POLICY "Public can view active daily specials" ON daily_specials
  FOR SELECT USING (is_active = true);

-- Public can create orders
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Public can create order items
CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Insert sample data for fast food menu
INSERT INTO menu_items (name, description, price, category, is_available, stock_quantity) VALUES
  ('Classic Burger', 'Juicy beef burger with lettuce, tomato, and special sauce', 3500, 'Burgers', true, 50),
  ('Chicken Burger', 'Crispy chicken fillet with mayo and pickles', 3000, 'Burgers', true, 40),
  ('Cheese Burger', 'Double cheese beef burger with caramelized onions', 4000, 'Burgers', true, 30),
  ('Poulet Frit (4 pcs)', 'Crispy fried chicken pieces', 4500, 'Chicken', true, 60),
  ('Poulet Frit (8 pcs)', 'Family pack crispy fried chicken', 8000, 'Chicken', true, 40),
  ('Sandwich Poulet', 'Grilled chicken sandwich with vegetables', 2500, 'Sandwiches', true, 35),
  ('Sandwich Thon', 'Tuna sandwich with fresh vegetables', 2000, 'Sandwiches', true, 30),
  ('Frites', 'Crispy french fries', 1000, 'Sides', true, 100),
  ('Frites Sauce', 'French fries with special sauce', 1500, 'Sides', true, 80),
  ('Coca Cola', 'Cold Coca Cola', 500, 'Drinks', true, 150),
  ('Jus de Bissap', 'Traditional hibiscus juice', 800, 'Drinks', true, 50);

-- Insert sample daily special
INSERT INTO daily_specials (name, description, price, is_active, active_date, stock_quantity) VALUES
  ('Thiéboudienne', 'Traditional Senegalese rice and fish dish with vegetables', 5000, true, CURRENT_DATE, 30);
