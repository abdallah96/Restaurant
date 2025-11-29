import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/auth/jwt';

const menuItems = [
  // Burgers
  {
    name: 'Burger Chicken',
    description: 'Burger au poulet croustillant',
    price: 2500,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Burger Cheese',
    description: 'Burger au fromage fondant',
    price: 2000,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Burger Zinger',
    description: 'Burger épicé avec poulet croustillant',
    price: 3000,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500',
    is_available: true,
    stock_quantity: 999,
  },

  // Tacos
  {
    name: 'Tacos Poulet',
    description: 'Tacos garni de poulet',
    price: 3000,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Tacos Viande',
    description: 'Tacos garni de viande',
    price: 3000,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Tacos 3 Viandes',
    description: 'Tacos avec trois viandes différentes',
    price: 3500,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=500',
    is_available: true,
    stock_quantity: 999,
  },

  // Chawarma
  {
    name: 'Chawarma Poulet',
    description: 'Chawarma au poulet mariné',
    price: 1500,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Chawarma Viande',
    description: 'Chawarma à la viande',
    price: 1500,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Chawarma Royal',
    description: 'Chawarma mixte premium',
    price: 2000,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500',
    is_available: true,
    stock_quantity: 999,
  },

  // Sandwichs
  {
    name: 'Norvégienne',
    description: 'Sandwich norvégien',
    price: 1500,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Étudiant',
    description: 'Sandwich étudiant',
    price: 2000,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Sandwich Viande',
    description: 'Sandwich à la viande',
    price: 1000,
    category: 'Entrées',
    image_url: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Sandwich Poulet',
    description: 'Sandwich au poulet',
    price: 1000,
    category: 'Entrées',
    image_url: 'https://images.unsplash.com/photo-1619894991209-e83d0b6b8cf2?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Twister',
    description: 'Wrap croustillant',
    price: 2500,
    category: 'Entrées',
    image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500',
    is_available: true,
    stock_quantity: 999,
  },

  // Boissons
  {
    name: 'Coca',
    description: 'Coca-Cola',
    price: 500,
    category: 'Boissons',
    image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Sprite',
    description: 'Sprite',
    price: 500,
    category: 'Boissons',
    image_url: 'https://images.unsplash.com/photo-1625740515829-f318c8ca763e?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Fanta',
    description: 'Fanta',
    price: 500,
    category: 'Boissons',
    image_url: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Ginger',
    description: 'Ginger ale',
    price: 500,
    category: 'Boissons',
    image_url: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Bissap',
    description: 'Jus d\'hibiscus',
    price: 500,
    category: 'Boissons',
    image_url: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Bouye',
    description: 'Jus de pain de singe',
    price: 500,
    category: 'Boissons',
    image_url: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Eau',
    description: 'Eau minérale',
    price: 200,
    category: 'Boissons',
    image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500',
    is_available: true,
    stock_quantity: 999,
  },

  // Desserts
  {
    name: 'Crêpe Nutella',
    description: 'Crêpe au Nutella',
    price: 1500,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Crêpe Nutella Premium',
    description: 'Grande crêpe au Nutella',
    price: 2000,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Milkshake Vanille',
    description: 'Milkshake à la vanille',
    price: 2500,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Milkshake Chocolat',
    description: 'Milkshake au chocolat',
    price: 2500,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Milkshake Fraise',
    description: 'Milkshake à la fraise',
    price: 2500,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Milkshake Caramel Spéculoos',
    description: 'Milkshake caramel et spéculoos',
    price: 2500,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1625869016774-3fa96fbe9b93?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Smoothie Mangue Banane',
    description: 'Smoothie mangue et banane',
    price: 2500,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Smoothie Fraise',
    description: 'Smoothie à la fraise',
    price: 2500,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500',
    is_available: true,
    stock_quantity: 999,
  },
];

const dailySpecials: any[] = [
  // User will add their own daily specials via the admin panel
];

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Insert menu items
    const { data: menuData, error: menuError } = await supabase
      .from('menu_items')
      .insert(menuItems)
      .select();

    if (menuError) {
      console.error('Error inserting menu items:', menuError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to seed menu items', 
        details: menuError 
      }, { status: 500 });
    }

    // Insert daily specials
    const { data: specialsData, error: specialsError } = await supabase
      .from('daily_specials')
      .insert(dailySpecials)
      .select();

    if (specialsError) {
      console.error('Error inserting daily specials:', specialsError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to seed daily specials', 
        details: specialsError 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        menuItems: menuData?.length,
        dailySpecials: specialsData?.length,
      }
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: 'Failed to seed database' }, { status: 500 });
  }
}
