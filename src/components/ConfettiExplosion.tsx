"use client";

import { useEffect, useState } from 'react';

const ConfettiPiece = ({ id, style }: { id: number, style: React.CSSProperties }) => (
  <div
    key={id}
    className="confetti-piece"
    style={style}
  />
);

export function ConfettiExplosion() {
  const [pieces, setPieces] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 150 }).map((_, index) => {
        const x = Math.random() * 100; // vw
        const y = -20 - Math.random() * 30; // vh
        const rotation = Math.random() * 360;
        const scale = 0.5 + Math.random();
        const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        const duration = 3 + Math.random() * 2;
        const delay = Math.random() * 1;
        
        return {
            id: index,
            style: {
                left: `${x}vw`,
                top: `${y}vh`,
                transform: `rotate(${rotation}deg) scale(${scale})`,
                backgroundColor: color,
                animation: `fall ${duration}s ease-out ${delay}s forwards`,
            }
        };
    });
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
        {pieces.map(p => <ConfettiPiece key={p.id} id={p.id} style={p.style} />)}
    </div>
  );
}
