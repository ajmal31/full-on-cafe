export interface MenuItem {
  id: number;
  name: string;
  category: 'Starters' | 'Main Course' | 'Drinks' | 'Desserts';
  price: number;
  description: string;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableNumber: number | string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Served';
  createdAt: string;
}
