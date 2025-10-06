"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/lib/types";
import { CheckCircle2, Download } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ConfettiExplosion } from "@/components/ConfettiExplosion";

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const billRef = useRef<HTMLDivElement>(null);
  const checkmarkRef = useRef<SVGSVGElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const orderId = searchParams.get('orderId');
    if (orderId) {
      try {
        const allOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
        const currentOrder = allOrders.find(o => o.id === orderId);
        setOrder(currentOrder || null);
        if (currentOrder) {
          setShowConfetti(true);
        }
      } catch (error) {
        console.error("Failed to parse orders from localStorage", error);
        setOrder(null);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (order && checkmarkRef.current) {
        checkmarkRef.current.classList.add('animate-check-in');
    }
  }, [order]);

  const handleDownloadPdf = () => {
    if (!billRef.current || !order) return;

    html2canvas(billRef.current, { backgroundColor: '#0a0a0a' }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / pdfWidth;
      const height = canvasHeight / ratio;

      if (height > pdfHeight) {
          console.warn("content is larger than a single page, multi-page pdf not implemented")
      }

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, height);
      pdf.save(`full-on-cafe-bill-${order.id}.pdf`);
    });
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <>
      <Header title="Order Not Found" />
      <main className="container mx-auto py-8 px-4 flex justify-center items-center">
        <Card className="w-full max-w-2xl text-center p-8">
            <CardTitle className="text-2xl font-bold mb-4">Order Not Found</CardTitle>
            <CardDescription className="text-muted-foreground mb-6">We couldn't find the details for this order. It might have been cleared or there was an error.</CardDescription>
            <Button asChild>
            <Link href="/">Start a New Order</Link>
            </Button>
        </Card>
      </main>
      </>
    );
  }

  return (
    <>
      <Header title="Order Confirmation" />
      <main className="container mx-auto py-8 px-4 flex justify-center items-start min-h-[calc(100vh-80px)] relative">
        {showConfetti && <ConfettiExplosion />}
        <Card ref={billRef} className="w-full max-w-2xl shadow-lg bg-card/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 ref={checkmarkRef} className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-headline text-primary">Order Confirmed!</CardTitle>
            <CardDescription>Thank you for your order. We're preparing it now.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">{order.orderType === 'Dining' ? 'Table Number' : 'Order Type'}</p>
                <p className="font-bold text-lg">{order.tableNumber}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Order Status</p>
                <Badge variant={order.status === 'Served' ? 'default' : 'secondary'}>{order.status}</Badge>
              </div>
              <Separator />
              <h3 className="font-semibold text-primary">Ordered Items</h3>
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
          <CardFooter className="flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link href={`/${typeof order.tableNumber === 'number' ? `?table=${order.tableNumber}`: ''}`}>Start New Order</Link>
            </Button>
            <Button variant="outline" onClick={handleDownloadPdf}>
                <Download className="mr-2 h-4 w-4"/>
                Download Bill
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
