"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Badge } from "@/components/ui/badge";

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const orderId = searchParams.get('orderId');
    if (orderId) {
      try {
        const allOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
        const currentOrder = allOrders.find(o => o.id === orderId);
        setOrder(currentOrder || null);
      } catch (error) {
        console.error("Failed to parse orders from localStorage", error);
        setOrder(null);
      }
    }
  }, [searchParams]);

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the details for this order. It might have been cleared or there was an error.</p>
        <Button asChild>
          <Link href="/">Start a New Order</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Header title="Order Confirmation" />
      <main className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-headline">Order Confirmed!</CardTitle>
            <CardDescription>Thank you for your order. We're preparing it now.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Table Number</p>
                <p className="font-bold text-lg">{order.tableNumber}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Order Status</p>
                <Badge variant={order.status === 'Served' ? 'default' : 'secondary'}>{order.status}</Badge>
              </div>
              <Separator />
              <h3 className="font-semibold">Ordered Items</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name} <span className="text-muted-foreground">x {item.quantity}</span></span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between items-center text-xl font-bold">
                <p>Total Bill</p>
                <p className="text-primary">₹{order.totalAmount}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href={`/?table=${order.tableNumber}`}>Start New Order</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading confirmation...</div>}>
            <CheckoutPageContent />
        </Suspense>
    )
}
