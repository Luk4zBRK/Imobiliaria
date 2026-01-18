import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface WhatsAppButtonProps {
  message?: string;
}

export function WhatsAppButton({ message }: WhatsAppButtonProps) {
  const defaultMessage = 'Olá Erik vim do site e gostaria de maiores informações';
  const encodedMessage = encodeURIComponent(message || defaultMessage);
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=5519992372866&text=${encodedMessage}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-success rounded-full shadow-lg hover:shadow-xl transition-shadow"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-primary-foreground" fill="currentColor" />
    </motion.a>
  );
}
