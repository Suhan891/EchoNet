"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

const Navbar = () => {
  const { setTheme } = useTheme();
  return (
    <nav className="px-6 py-4 flex items-center justify-between top-0 sticky z-50 bg-background/70 backdrop-blur-lg border-b border-border/40 transition-all duration-300">
      <div className="font-extrabold text-2xl tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Sparkles className="w-6 h-6 text-primary" />
        <Link href={"/"} className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          EchoNet
        </Link>
      </div>
      
      <div className="hidden md:flex gap-6 items-center">
        <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Features
        </Link>
        <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Technology
        </Link>
        <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          About
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-secondary/50 hover:bg-secondary">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href={"/login"}>
          <Button
            className="px-6 rounded-full shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105 font-semibold"
            variant={"default"}
          >
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

