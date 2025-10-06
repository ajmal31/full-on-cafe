"use client";

import { useCart } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { Order } from "@/lib/types";

function CartPageContent() {
  const { cartItems, updateQuantity, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tableNumber, setTableNumber] = useState<number | null>(null);

  useEffect(() => {
    const table = searchParams.get('table');
    if (table && !isNaN(parseInt(table))) {
      setTableNumber(parseInt(table));
    }
  }, [searchParams]);

  const handlePlaceOrder = () => {
    if (tableNumber === null) {
      alert("Table number is not specified. Please go back to the menu and use the QR code link (e.g., /?table=1).");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderId = `${tableNumber}-${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      tableNumber,
      items: cartItems.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
      totalAmount: getCartTotal(),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const existingOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
    } catch (error) {
      console.error("Could not save order to localStorage", error);
    }
    
    clearCart();
    router.push(`/checkout?orderId=${orderId}`);
  };

  return (
    <>
      <Header title={tableNumber ? `Your Cart (Table ${tableNumber})` : "Your Cart"} />
      <main className="container mx-auto py-8 px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Review Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between flex-wrap">
                    <div className="flex items-center gap-4">
                      <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md object-cover" />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive" onClick={() => updateQuantity(item.id, 0)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <p className="w-20 text-right font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="flex justify-end items-center">
                  <p className="text-lg font-bold">Total:</p>
                  <p className="text-xl font-bold text-primary ml-4">₹{getCartTotal()}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/${tableNumber ? `?table=${tableNumber}` : ''}`}>Back to Menu</Link>
            </Button>
            <Button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0 || tableNumber === null}
              className="transform transition-transform hover:scale-105"
            >
              Place Order
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}

export default function CartPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading cart...</div>}>
            <CartPageContent />
        </Suspense>
    )
}
