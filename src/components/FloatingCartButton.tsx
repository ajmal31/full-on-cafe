"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

export function FloatingCartButton() {
  const { getCartItemCount } = useCart();
  const searchParams = useSearchParams();
  const table = searchParams.get('table');
  const itemCount = getCartItemCount();

  if (itemCount === 0) {
    return null;
  }

  return (
    <Link href={`/cart${table ? `?table=${table}` : ''}`} passHref>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg transform hover:scale-110 transition-transform"
        aria-label={`View cart with ${itemCount} items`}
      >
        <ShoppingCart className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
          {itemCount}
        </span>
      </Button>
    </Link>
  );
}
