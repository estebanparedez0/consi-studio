interface WhatsAppFloatingButtonProps {
  href: string;
}

export function WhatsAppFloatingButton({ href }: WhatsAppFloatingButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-28 right-4 z-30 inline-flex min-h-14 items-center justify-center rounded-full bg-[#2f6a56] px-5 text-sm font-medium text-white shadow-soft transition duration-200 hover:opacity-95 lg:bottom-6"
    >
      WhatsApp
    </a>
  );
}
