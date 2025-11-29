import { track } from '@vercel/analytics'

// Track when user views menu items
export const trackMenuView = (category?: string) => {
  track('menu_viewed', {
    category: category || 'all',
    timestamp: new Date().toISOString(),
  })
}

// Track when user adds item to cart
export const trackAddToCart = (item: {
  id: string
  name: string
  price: number
  quantity: number
  type: 'menu_item' | 'daily_special'
}) => {
  track('add_to_cart', {
    item_id: item.id,
    item_name: item.name,
    item_price: item.price,
    quantity: item.quantity,
    item_type: item.type,
    timestamp: new Date().toISOString(),
  })
}

// Track when user removes item from cart
export const trackRemoveFromCart = (item: {
  id: string
  name: string
  price: number
}) => {
  track('remove_from_cart', {
    item_id: item.id,
    item_name: item.name,
    item_price: item.price,
    timestamp: new Date().toISOString(),
  })
}

// Track when user updates cart quantity
export const trackUpdateCartQuantity = (item: {
  id: string
  name: string
  oldQuantity: number
  newQuantity: number
}) => {
  track('update_cart_quantity', {
    item_id: item.id,
    item_name: item.name,
    old_quantity: item.oldQuantity,
    new_quantity: item.newQuantity,
    timestamp: new Date().toISOString(),
  })
}

// Track when user clears cart
export const trackClearCart = (itemCount: number, totalAmount: number) => {
  track('clear_cart', {
    item_count: itemCount,
    total_amount: totalAmount,
    timestamp: new Date().toISOString(),
  })
}

// Track order placement
export const trackOrderPlaced = (order: {
  items: Array<{ id: string; name: string; price: number; quantity: number }>
  totalAmount: number
  orderType: 'pickup' | 'delivery'
  itemCount: number
}) => {
  // Serialize items to JSON string for Vercel Analytics
  const itemsData = order.items.map(item => `${item.name}(${item.quantity})`).join(', ')
  
  track('order_placed', {
    total_amount: order.totalAmount,
    item_count: order.itemCount,
    order_type: order.orderType,
    items_summary: itemsData,
    timestamp: new Date().toISOString(),
  })
  
  // Track individual item purchases for popularity analysis
  order.items.forEach(item => {
    track('item_purchased', {
      item_id: item.id,
      item_name: item.name,
      item_price: item.price,
      quantity: item.quantity,
      order_type: order.orderType,
      timestamp: new Date().toISOString(),
    })
  })
}

// Track category filter changes
export const trackCategoryFilter = (category: string) => {
  track('category_filtered', {
    category,
    timestamp: new Date().toISOString(),
  })
}

// Track daily special views
export const trackDailySpecialView = (specialId: string, specialName: string) => {
  track('daily_special_viewed', {
    special_id: specialId,
    special_name: specialName,
    timestamp: new Date().toISOString(),
  })
}

// Track checkout initiation
export const trackCheckoutInitiated = (cartTotal: number, itemCount: number) => {
  track('checkout_initiated', {
    cart_total: cartTotal,
    item_count: itemCount,
    timestamp: new Date().toISOString(),
  })
}

// Track order type selection
export const trackOrderTypeSelected = (orderType: 'pickup' | 'delivery') => {
  track('order_type_selected', {
    order_type: orderType,
    timestamp: new Date().toISOString(),
  })
}

// Track page visits
export const trackPageView = (page: string) => {
  track('page_viewed', {
    page,
    timestamp: new Date().toISOString(),
  })
}

// Track item detail views (when users click on items to see more)
export const trackItemDetailView = (item: {
  id: string
  name: string
  category?: string
  price: number
}) => {
  track('item_detail_viewed', {
    item_id: item.id,
    item_name: item.name,
    item_category: item.category || 'daily_special',
    item_price: item.price,
    timestamp: new Date().toISOString(),
  })
}
