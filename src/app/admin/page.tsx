"use client";

import { useEffect, useState, useRef } from "react";
import type { Order } from "@/lib/types";
import { Header } from "@/components/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from 'date-fns';
import { Separator } from "@/components/ui/separator";
import { Download, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function BillContent({ order, billRef }: { order: Order, billRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div ref={billRef} className="bg-background p-6 rounded-lg">
       <div className="text-center mb-4">
            <h2 className="text-2xl font-bold font-headline text-amber-400">Full on Cafe</h2>
            <p className="text-sm text-muted-foreground">Order Bill</p>
        </div>
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-muted-foreground">{order.orderType === 'Dining' ? 'Table Number' : 'Order Type'}</p>
                <p className="font-bold text-lg">{order.tableNumber}</p>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Order Status</p>
                <Badge variant={order.status === 'Served' ? 'default' : 'secondary'}>{order.status}</Badge>
            </div>
             <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Time</p>
                <p>{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</p>
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
    </div>
  );
}


export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const billRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const fetchOrders = () => {
      try {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(storedOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        console.error("Failed to parse orders from localStorage", error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsServed = (orderId: string) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: 'Served' as 'Served' } : order
    );
    try {
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Failed to update orders in localStorage", error);
    }
  };

  const handleDownloadPdf = (order: Order) => {
    if (!billRef.current || !order) return;

    html2canvas(billRef.current, { backgroundColor: '#0a0a0a' }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasWidth = canvas.width;
      const ratio = canvasWidth / pdfWidth;
      const height = canvas.height / ratio;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, height);
      pdf.save(`full-on-cafe-bill-${order.id}.pdf`);
    });
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <p className="text-lg font-semibold">Loading Dashboard...</p>
            <p className="text-sm text-muted-foreground">Waiting for client to mount.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header title="Admin Dashboard — Live Orders" />
      <main className="container mx-auto py-8 px-4">
        <div className="bg-card/50 rounded-lg shadow-lg overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Table/Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center w-[120px]">Status</TableHead>
                <TableHead className="w-[150px]">Time</TableHead>
                <TableHead className="text-right w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? orders.map(order => (
                <TableRow key={order.id} className="hover:bg-muted/50">
                  <TableCell className="font-bold text-lg">{order.tableNumber}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="p-0 h-auto text-base text-primary">{order.items.length} items</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Order Details ({typeof order.tableNumber === 'number' ? `Table ${order.tableNumber}`: order.tableNumber})</DialogTitle>
                           <DialogDescription>
                            Order ID: {order.id}
                          </DialogDescription>
                        </DialogHeader>
                        <BillContent order={order} billRef={billRef} />
                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => handleDownloadPdf(order)}>
                                <Download className="mr-2 h-4 w-4"/>
                                Download Bill
                            </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="text-right font-semibold font-mono">₹{order.totalAmount}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={order.status === 'Served' ? 'default' : 'destructive'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</TableCell>
                  <TableCell className="text-right">
                    {order.status === 'Pending' && (
                      <Button size="sm" onClick={() => handleMarkAsServed(order.id)}>
                        Mark as Served
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                        No active orders.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  );
}
