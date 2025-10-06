"use client";

import { useState, Suspense, useEffect } from 'react';
import { initialMenuData } from '@/lib/menu-data';
import type { MenuItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { FloatingCartButton } from '@/components/FloatingCartButton';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const categories = ['All', 'Starters', 'Main Course', 'Drinks', 'Desserts'];

function MenuItemCard({ item, onAddToCart }: { item: MenuItem, onAddToCart: (item: MenuItem) => void }) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg transform transition-shadow duration-300 hover:shadow-xl bg-card/50 hover:bg-card">
      <CardHeader className="p-0">
        <div className="aspect-[3/2] relative w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            data-ai-hint={`${item.category.toLowerCase().split(' ')[0]} food`}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-bold font-headline text-primary">{item.name}</CardTitle>
        <CardDescription className="mt-2 text-sm text-muted-foreground">{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex items-center justify-between">
        <p className="text-lg font-bold text-foreground">₹{item.price}</p>
        <Button onClick={() => onAddToCart(item)} size="sm" className="gap-2 transform transition-transform hover:scale-105">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}

function MenuPageContent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedMenu = localStorage.getItem('menuItems');
      if (storedMenu) {
        setMenuData(JSON.parse(storedMenu));
      } else {
        localStorage.setItem('menuItems', JSON.stringify(initialMenuData));
        setMenuData(initialMenuData);
      }
    } catch (error) {
      console.error("Failed to process menu data from localStorage", error);
      setMenuData(initialMenuData);
    }
    
    const handleStorageUpdate = () => {
        const storedMenu = localStorage.getItem('menuItems');
        if (storedMenu) {
            setMenuData(JSON.parse(storedMenu));
        }
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const filteredMenu = activeCategory === 'All'
    ? menuData
    : menuData.filter(item => item.category === activeCategory);

  if (!isMounted) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
              <p className="text-lg font-semibold">Loading Menu...</p>
          </div>
        </div>
      );
  }

  return (
    <>
      <Header title="Full on Cafe" showAdminLink={true} />
      <main className="container mx-auto py-8 px-4">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 bg-background/60">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMenu.map(item => (
            <MenuItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </main>
      <FloatingCartButton />
    </>
  );
}


export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuPageContent />
    </Suspense>
  );
}
