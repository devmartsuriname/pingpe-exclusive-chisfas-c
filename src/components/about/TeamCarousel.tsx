import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
}

interface TeamCarouselProps {
  members: TeamMember[];
  autoPlayInterval?: number;
}

export const TeamCarousel = ({
  members,
  autoPlayInterval = 5000,
}: TeamCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % members.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, autoPlayInterval, members.length, prefersReducedMotion]);

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + members.length) % members.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % members.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[0, 1, 2].map((offset) => {
              const index = (currentIndex + offset) % members.length;
              const member = members[index];
              const initials = member.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();

              return (
                <motion.div
                  key={index}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    z: 50,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group relative bg-background/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  {/* Glassmorphic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <Avatar className="w-24 h-24 border-2 border-primary/20 relative">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-lg">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <h3 className="text-xl font-semibold mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-primary font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {member.bio}
                      </p>

                      {member.social && (
                        <div className="flex gap-2">
                          {member.social.linkedin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              asChild
                            >
                              <a
                                href={member.social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Linkedin className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {member.social.twitter && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              asChild
                            >
                              <a
                                href={member.social.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Twitter className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2">
          {members.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
