import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const menuItems = [
  // Plats Principaux
  {
    name: 'Thiéboudienne',
    description: 'Riz au poisson, légumes et sauce tomate épicée - le plat national du Sénégal',
    price: 3500,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Mafé',
    description: 'Ragoût de viande dans une sauce onctueuse aux arachides',
    price: 3000,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Yassa Poulet',
    description: 'Poulet mariné aux oignons, citron et moutarde, servi avec du riz',
    price: 3200,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Thiou Viande',
    description: 'Viande de boeuf mijotée avec légumes dans une sauce tomate',
    price: 2800,
    category: 'Plats Principaux',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
    is_available: true,
    stock_quantity: 999,
  },

  // Entrées
  {
    name: 'Pastels',
    description: 'Beignets de poisson croustillants, spécialité sénégalaise',
    price: 500,
    category: 'Entrées',
    image_url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Fataya',
    description: 'Chaussons frits farcis à la viande épicée',
    price: 600,
    category: 'Entrées',
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Salade Niébé',
    description: 'Salade de haricots noirs aux légumes frais',
    price: 1000,
    category: 'Entrées',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
    is_available: true,
    stock_quantity: 999,
  },

  // Desserts
  {
    name: 'Thiakry',
    description: 'Dessert au couscous, yaourt et crème vanillée',
    price: 1200,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Ngalakh',
    description: 'Pâte d\'arachide sucrée aux fruits secs',
    price: 1000,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500',
    is_available: true,
    stock_quantity: 999,
  },

  // Boissons
  {
    name: 'Bissap',
    description: 'Jus d\'hibiscus glacé, boisson traditionnelle',
    price: 500,
    category: 'Boissons',
    image_url: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Bouye',
    description: 'Jus de pain de singe crémeux et rafraîchissant',
    price: 600,
    category: 'Boissons',
    image_url: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Café Touba',
    description: 'Café sénégalais épicé au poivre de Guinée',
    price: 300,
    category: 'Boissons',
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500',
    is_available: true,
    stock_quantity: 999,
  },

  // Accompagnements
  {
    name: 'Riz Blanc',
    description: 'Riz blanc parfumé',
    price: 500,
    category: 'Accompagnements',
    image_url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500',
    is_available: true,
    stock_quantity: 999,
  },
  {
    name: 'Alloco',
    description: 'Bananes plantains frites',
    price: 800,
    category: 'Accompagnements',
    image_url: 'https://images.unsplash.com/photo-1587334207863-c1f0b5e74ddc?w=500',
    is_available: true,
    stock_quantity: 999,
  },
]

const dailySpecials = [
  {
    name: 'Thiéboudienne du Chef',
    description: 'Notre version spéciale du plat national avec poisson frais et légumes de saison',
    price: 4000,
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    is_active: true,
    active_date: new Date().toISOString().split('T')[0],
    stock_quantity: 30,
  },
  {
    name: 'Yassa Poisson',
    description: 'Poisson frais mariné au citron et oignons caramélisés',
    price: 3800,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500',
    is_active: true,
    active_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    stock_quantity: 25,
  },
  {
    name: 'Soupe Kandia',
    description: 'Soupe de gombo avec viande et poisson fumé',
    price: 3500,
    image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500',
    is_active: true,
    active_date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
    stock_quantity: 20,
  },
]

async function seed() {
  console.log('🌱 Starting database seeding...')

  try {
    // Insert menu items
    console.log('📋 Inserting menu items...')
    const { data: menuData, error: menuError } = await supabase
      .from('menu_items')
      .insert(menuItems)
      .select()

    if (menuError) {
      console.error('❌ Error inserting menu items:', menuError)
    } else {
      console.log(`✅ Inserted ${menuData?.length} menu items`)
    }

    // Insert daily specials
    console.log('⭐ Inserting daily specials...')
    const { data: specialsData, error: specialsError } = await supabase
      .from('daily_specials')
      .insert(dailySpecials)
      .select()

    if (specialsError) {
      console.error('❌ Error inserting daily specials:', specialsError)
    } else {
      console.log(`✅ Inserted ${specialsData?.length} daily specials`)
    }

    console.log('🎉 Database seeding completed!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
