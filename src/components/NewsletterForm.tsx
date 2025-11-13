import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface NewsletterFormProps {
  layout?: "horizontal" | "vertical";
  showIcon?: boolean;
}

export function NewsletterForm({ layout = "horizontal", showIcon = true }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSuccess(true);
    
    toast({
      title: "Successfully subscribed! 🎉",
      description: "You'll receive exclusive deals and travel tips.",
    });

    // Reset after animation
    setTimeout(() => {
      setEmail("");
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`flex ${layout === "vertical" ? "flex-col" : "gap-2"} max-w-md mx-auto relative`}
    >
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`flex ${layout === "vertical" ? "flex-col gap-3" : "gap-2"} w-full`}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" disabled={isLoading}>
              {showIcon && <Mail className="h-4 w-4 mr-2" />}
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            }}
            className="flex items-center justify-center gap-3 py-3 px-6 bg-success/10 border border-success/20 rounded-lg w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                rotate: [0, -10, 10, -10, 0]
              }}
              transition={{
                scale: { delay: 0.1, type: "spring", stiffness: 300 },
                rotate: { delay: 0.2, duration: 0.5 }
              }}
              className="w-8 h-8 rounded-full bg-success flex items-center justify-center"
            >
              <Check className="w-5 h-5 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-success font-medium"
            >
              Successfully subscribed!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
