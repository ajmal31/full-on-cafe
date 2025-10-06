import type { MenuItem } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    return image ? image.imageUrl : `https://picsum.photos/seed/${id}/600/400`;
}

export const menuData: MenuItem[] = [
  {
    id: 1,
    name: "Chicken Biryani",
    category: "Main Course",
    price: 180,
    description: "Aromatic rice dish with tender chicken and spices.",
    image: getImage("1")
  },
  {
    id: 2,
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 160,
    description: "Creamy and rich curry with soft paneer cubes.",
    image: getImage("2")
  },
  {
    id: 3,
    name: "French Fries",
    category: "Starters",
    price: 90,
    description: "Crispy golden-fried potato sticks.",
    image: getImage("3")
  },
  {
    id: 4,
    name: "Lime Soda",
    category: "Drinks",
    price: 40,
    description: "Refreshing sparkling drink with a tangy lime twist.",
    image: getImage("4")
  },
  {
    id: 5,
    name: "Gulab Jamun",
    category: "Desserts",
    price: 70,
    description: "Soft, spongy balls soaked in sweet syrup.",
    image: getImage("5")
  }
];
