"use client";

import { useCart } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, Armchair } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { Order } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

function CartPageContent() {
  const { cartItems, updateQuantity, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [tableNumber, setTableNumber] = useState<string>("");
  const [initialTable, setInitialTable] = useState<string | null>(null);

  useEffect(() => {
    const table = searchParams.get('table');
    if (table) {
      setTableNumber(table);
      setInitialTable(table);
    }
  }, [searchParams]);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      toast({ variant: "destructive", title: "Empty Cart", description: "Your cart is empty." });
      return;
    }
    if (!tableNumber) {
        toast({ variant: "destructive", title: "Table number required", description: "Please enter your table number to place a dining order." });
        return;
    }

    const orderId = `${tableNumber}-${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      tableNumber: isNaN(parseInt(tableNumber)) ? tableNumber : parseInt(tableNumber),
      items: cartItems.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
      totalAmount: getCartTotal(),
      status: "Pending",
      createdAt: new Date().toISOString(),
      orderType: "Dining",
    };

    try {
      const existingOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
    } catch (error) {
      console.error("Could not save order to localStorage", error);
      toast({ variant: "destructive", title: "Error", description: "Could not save your order." });
    }
    
    clearCart();
    router.push(`/checkout?orderId=${orderId}`);
  };
  
  const displayTable = initialTable ? `Table ${initialTable}` : "Your Cart";

  return (
    <>
      <Header title={displayTable} />
      <main className="container mx-auto py-8 px-4">
        <Card className="shadow-lg bg-card/50">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Review Your Order</CardTitle>
            <CardDescription>Check your items and enter your table number.</CardDescription>
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

                <div className="space-y-2">
                    <Label htmlFor="tableNumber" className="flex items-center gap-2">
                      <Armchair className="h-5 w-5 text-primary" />
                      Table Number
                    </Label>
                    <Input 
                        id="tableNumber"
                        type="text"
                        placeholder="Enter your table number"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="max-w-xs"
                        disabled={!!initialTable}
                    />
                </div>

                <div className="flex justify-end items-center pt-4">
                  <p className="text-lg font-bold">Total:</p>
                  <p className="text-xl font-bold text-primary ml-4">₹{getCartTotal()}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/${initialTable ? `?table=${initialTable}` : ''}`}>Back to Menu</Link>
            </Button>
            <Button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
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
