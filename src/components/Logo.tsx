import Image from 'next/image';
import { cn } from '@/lib/utils';
import { FullOnCafeLogo } from '@/lib/placeholder-images';

type LogoProps = {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <div className={cn("relative", className)}>
            <Image
                src={FullOnCafeLogo}
                alt="Full on Cafe Logo"
                fill
                className="object-contain"
                sizes="48px"
                unoptimized // Using unoptimized for external placeholder URLs
            />
        </div>
    );
}
