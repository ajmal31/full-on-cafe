import type { MenuItem } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    // Fallback to a default picsum image if not found, to avoid breaking the app.
    return image ? image.imageUrl : `https://picsum.photos/seed/${id}/600/400`;
}

export const initialMenuData: MenuItem[] = [
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
  },
  {
    id: 6,
    name: "Vegetable Hakka Noodles",
    category: "Main Course",
    price: 140,
    description: "Stir-fried noodles with a mix of fresh vegetables.",
    image: getImage("6")
  },
  {
    id: 7,
    name: "Chilli Gobi",
    category: "Starters",
    price: 120,
    description: "Crispy cauliflower florets tossed in a spicy sauce.",
    image: getImage("7")
  },
  {
    id: 8,
    name: "Masala Chai",
    category: "Drinks",
    price: 30,
    description: "Aromatic and spiced Indian tea.",
    image: getImage("8")
  },
  {
    id: 9,
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 110,
    description: "Fudgy chocolate brownie served with a scoop of ice cream.",
    image: getImage("9")
  },
  {
    id: 10,
    name: "Mutton Rogan Josh",
    category: "Main Course",
    price: 220,
    description: "Aromatic lamb curry with a blend of intense spices.",
    image: getImage("10")
  }
];
