import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Zap, Shield, Layers, ArrowRight, Sparkles, Code, Server, Database, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] w-full">
      {/* 1. HERO SECTION */}
      <section className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
        {/* Abstract Glowing Blob Background */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-4xl py-32 sm:py-40 lg:py-48 text-center animate-in fade-in zoom-in duration-700 ease-in-out">
          <Badge variant="secondary" className="mb-8 py-1.5 px-4 text-sm font-medium rounded-full border-primary/20 shadow-sm transition-all hover:scale-105">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-500 animate-pulse" />
            EchoNet v0.1.0 Beta is Live
          </Badge>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground/50 pb-4">
            Experience Social,<br /> Redefined.
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
            EchoNet is a modern, full-stack social media platform engineered for seamless content sharing, real-time messaging, and high-performance user interaction.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/login">
              <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 group h-12 text-md">
                Join the Community <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-md hover:bg-secondary transition-colors">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ARCHITECTURE / FEATURES GRID */}
      <section id="features" className="py-24 sm:py-32 bg-secondary/30 border-y border-border/50 relative overflow-hidden">
         {/* Subtle pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-primary tracking-wide uppercase">Deploy Faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Everything you need in a modern platform</p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Built from the ground up with a robust NestJS backend and a highly responsive Next.js frontend, featuring enterprise-level system architecture.
            </p>
          </div>

          <div className="mx-auto max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
              {/* Feature 1 */}
              <Card className="border border-border/50 bg-background/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20 group">
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Real-Time Messaging</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Experience instant direct and group chats powered by WebSockets (Socket.io) and Redis. Features live presence tracking and real-time read receipts.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="border border-border/50 bg-background/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20 group">
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Layers className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Polymorphic Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Advanced database design utilizing Prisma ORM allowing seamless likes and deeply nested comments (threading & replies) across Posts, Reels, and Stories.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="border border-border/50 bg-background/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20 group">
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Zap className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Background Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    High-performance media handling utilizing BullMQ message queues. Ephemeral stories and high-res post uploads process reliably in the background without blocking the main thread.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card className="border border-border/50 bg-background/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20 group">
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Shield className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Enterprise Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Bulletproof authentication flows with strict separation of Auth (User) and Social (Profile) domains. Includes stateless JWTs, Redis-backed sessions, and Nodemailer OTPs.
                  </CardDescription>
                </CardContent>
              </Card>
            </dl>
          </div>
        </div>
      </section>

      {/* 3. TECH STACK SHOWCASE */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-sm font-semibold leading-8 tracking-widest text-muted-foreground uppercase mb-12">
            Powered by industry-standard technologies
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4 items-center justify-items-center opacity-80">
            <div className="flex flex-col items-center gap-3 transition-transform hover:scale-110">
              <Server className="w-10 h-10 text-[#E0234E]" />
              <span className="font-semibold text-lg">NestJS v11</span>
            </div>
            <div className="flex flex-col items-center gap-3 transition-transform hover:scale-110">
              <Smartphone className="w-10 h-10 text-foreground" />
              <span className="font-semibold text-lg">Next.js App Router</span>
            </div>
            <div className="flex flex-col items-center gap-3 transition-transform hover:scale-110">
              <Database className="w-10 h-10 text-[#316192]" />
              <span className="font-semibold text-lg">PostgreSQL & Prisma</span>
            </div>
            <div className="flex flex-col items-center gap-3 transition-transform hover:scale-110">
              <Code className="w-10 h-10 text-[#DC382D]" />
              <span className="font-semibold text-lg">Redis & Socket.io</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER CTA */}
      <section className="relative isolate mt-auto overflow-hidden bg-primary/10 border-t border-primary/20 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-foreground">
            Ready to jump in?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Join developers and creators worldwide using EchoNet to stay connected. Experience the speed, reliability, and beautiful UI of a modern tech stack.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-10 h-14 text-lg font-semibold hover:scale-105 transition-all shadow-xl shadow-primary/20">
                Create an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
