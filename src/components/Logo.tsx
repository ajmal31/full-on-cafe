import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <div className={cn("relative", className)}>
            <Image
                src="/full-on-cafe-logo.png"
                alt="Full on Cafe Logo"
                fill
                className="object-contain"
                sizes="48px"
            />
        </div>
    );
}
