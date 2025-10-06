"use client";

import { useState, Suspense, useEffect, useRef } from 'react';
import { menuData } from '@/lib/menu-data';
import type { MenuItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { FloatingCartButton } from '@/components/FloatingCartButton';
import { useToast } from '@/hooks/use-toast';
import { Plus, Camera, CameraOff } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);

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

  return (
    <>
      <Header title="Full on Cafe" showAdminLink={true} />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8 relative rounded-lg overflow-hidden border">
           <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              {hasCameraPermission === false && (
                <Alert variant="destructive" className="max-w-sm bg-destructive/20 border-destructive">
                  <CameraOff className="h-4 w-4" />
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access to scan QR codes.
                  </AlertDescription>
              </Alert>
              )}
               {hasCameraPermission === true && (
                <div className="text-center text-white p-4 rounded-lg bg-black/30 backdrop-blur-sm">
                  <Camera className="h-12 w-12 mx-auto mb-2"/>
                  <h2 className="text-lg font-bold">Scan QR code on your table</h2>
                </div>
               )}
           </div>
        </div>

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
