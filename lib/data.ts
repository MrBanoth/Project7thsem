export interface Shop {
  id: string
  name: string
  image: string
  rating: number
  deliveryTime: string
  category: string
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  shopId: string
  inStock: boolean
}

export interface Order {
  id: string
  customerId: string
  shopId: string
  items: OrderItem[]
  total: number
  status: "pending" | "confirmed" | "ready" | "delivered"
  createdAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  ordersCount: number
}

// Sample shops data
export const shops: Shop[] = [
  {
    id: "1",
    name: "Sharma General Store",
    image: "/indian-grocery-store-front.jpg",
    rating: 4.5,
    deliveryTime: "15-30 min",
    category: "Groceries",
  },
  {
    id: "2",
    name: "Patel Kirana",
    image: "/traditional-kirana-store.jpg",
    rating: 4.2,
    deliveryTime: "20-35 min",
    category: "Groceries",
  },
  {
    id: "3",
    name: "Fresh Fruits Corner",
    image: "/fresh-fruits-vegetable-store.jpg",
    rating: 4.7,
    deliveryTime: "10-25 min",
    category: "Fruits & Vegetables",
  },
  {
    id: "4",
    name: "Gupta Dairy",
    image: "/dairy-milk-store-india.jpg",
    rating: 4.3,
    deliveryTime: "15-30 min",
    category: "Dairy",
  },
  {
    id: "5",
    name: "Spice Bazaar",
    image: "/indian-spices-store.jpg",
    rating: 4.6,
    deliveryTime: "25-40 min",
    category: "Spices",
  },
]

// Sample products data
export const products: Product[] = [
  // Sharma General Store products
  {
    id: "1",
    name: "Basmati Rice 1kg",
    price: 120,
    image: "/basmati-rice-packet.jpg",
    category: "Grains",
    shopId: "1",
    inStock: true,
  },
  {
    id: "2",
    name: "Toor Dal 500g",
    price: 85,
    image: "/toor-dal-lentils.jpg",
    category: "Pulses",
    shopId: "1",
    inStock: true,
  },
  {
    id: "3",
    name: "Cooking Oil 1L",
    price: 150,
    image: "/cooking-oil-bottle.png",
    category: "Oil",
    shopId: "1",
    inStock: false,
  },
  // Fresh Fruits Corner products
  {
    id: "4",
    name: "Fresh Bananas 1kg",
    price: 60,
    image: "/fresh-bananas-bunch.jpg",
    category: "Fruits",
    shopId: "3",
    inStock: true,
  },
  {
    id: "5",
    name: "Tomatoes 500g",
    price: 40,
    image: "/fresh-red-tomatoes.jpg",
    category: "Vegetables",
    shopId: "3",
    inStock: true,
  },
  // Gupta Dairy products
  {
    id: "6",
    name: "Fresh Milk 1L",
    price: 55,
    image: "/milk-bottle-fresh.jpg",
    category: "Dairy",
    shopId: "4",
    inStock: true,
  },
  {
    id: "7",
    name: "Paneer 250g",
    price: 120,
    image: "/fresh-paneer-cottage-cheese.jpg",
    category: "Dairy",
    shopId: "4",
    inStock: true,
  },
  // More products for variety
  {
    id: "8",
    name: "Wheat Flour 1kg",
    price: 45,
    image: "/wheat-flour-atta-packet.jpg",
    category: "Grains",
    shopId: "2",
    inStock: true,
  },
  {
    id: "9",
    name: "Turmeric Powder 100g",
    price: 35,
    image: "/turmeric-powder-spice.jpg",
    category: "Spices",
    shopId: "5",
    inStock: true,
  },
  {
    id: "10",
    name: "Red Chili Powder 100g",
    price: 40,
    image: "/red-chili-powder-spice.jpg",
    category: "Spices",
    shopId: "5",
    inStock: true,
  },
]

// Sample orders data
// orders moved to client-side OrdersContext

// Sample customers data
export const customers: Customer[] = [
  {
    id: "CUST001",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 9876543210",
    ordersCount: 15,
  },
  {
    id: "CUST002",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 9876543211",
    ordersCount: 8,
  },
  {
    id: "CUST003",
    name: "Amit Patel",
    email: "amit@example.com",
    phone: "+91 9876543212",
    ordersCount: 22,
  },
  {
    id: "CUST004",
    name: "Sunita Gupta",
    email: "sunita@example.com",
    phone: "+91 9876543213",
    ordersCount: 5,
  },
]
