"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/login-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

interface HeaderProps {
  isLoggedIn?: boolean;
  isOnboarded?: boolean;
}

export function Header({
  isLoggedIn = false,
  isOnboarded = false,
}: HeaderProps) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    window.location.href = "/dashboard";
  };

  return (
    <>
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold">Dorm Match</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
          </nav>

          {/* Auth Buttons + Theme Toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isLoggedIn && isOnboarded && (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            )}

            {isLoggedIn && !isOnboarded && (
              <Link href="/onboarding">
                <Button>Set up Profile</Button>
              </Link>
            )}

            {!isLoggedIn && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setLoginModalOpen(true)}
                  className="hidden sm:inline-flex"
                >
                  Sign In
                </Button>
                <Button onClick={() => setLoginModalOpen(true)}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <LoginModal
        open={loginModalOpen}
        onOpenChange={setLoginModalOpen}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
