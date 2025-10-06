"use client";

import { useEffect, useState } from "react";
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
} from "@/components/ui/dialog";
import { formatDistanceToNow } from 'date-fns';
import { Separator } from "@/components/ui/separator";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);

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
        <div className="bg-card rounded-lg shadow-lg overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Table</TableHead>
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
                        <Button variant="link" className="p-0 h-auto text-base">{order.items.length} items</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Order Details (Table {order.tableNumber})</DialogTitle>
                          <DialogDescription>
                            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="my-4">
                            <div className="space-y-2">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-1">
                                        <p>{item.name} <span className="text-muted-foreground text-sm">x {item.quantity}</span></p>
                                        <p className="font-mono">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-3"/>
                            <div className="flex justify-between items-center font-bold text-lg">
                                <p>Total</p>
                                <p>₹{order.totalAmount}</p>
                            </div>
                        </div>
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
