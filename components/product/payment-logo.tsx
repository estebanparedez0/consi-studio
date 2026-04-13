"use client";

import Image from "next/image";
import { useState } from "react";

interface PaymentLogoProps {
  src: string;
  alt: string;
}

export function PaymentLogo({ src, alt }: PaymentLogoProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <div className="h-5 w-9 shrink-0" aria-hidden="true" />;
  }

  return (
    <div className="relative h-5 w-9 shrink-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="36px"
        className="object-contain object-left"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
