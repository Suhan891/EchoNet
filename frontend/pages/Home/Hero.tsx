import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, Zap, Shield, Layers, ArrowRight, Sparkles, 
  Code, Server, Database, Smartphone, Activity, Lock, Users,
  CheckCircle2, Globe, Cpu, Infinity as InfinityIcon, RotateCcw, Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="flex flex-col w-full bg-background selection:bg-primary/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 lg:px-8">
        {/* Dynamic Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen opacity-50 dark:opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen opacity-50 dark:opacity-20"></div>

        <div className="mx-auto max-w-5xl text-center z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out mt-20">
          <Badge variant="secondary" className="mb-8 py-2 px-5 text-sm font-medium rounded-full border-primary/20 shadow-lg backdrop-blur-md transition-all hover:scale-105 bg-background/50">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-500 animate-pulse" />
            EchoNet v0.1.0 Beta
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-muted-foreground/60 leading-tight">
            The Future of <br className="hidden md:block"/> Social Connectivity
          </h1>
          
          <p className="mt-6 text-lg md:text-2xl leading-relaxed text-muted-foreground max-w-3xl mx-auto mb-10">
            A high-performance, enterprise-grade social network engineered for real-time interactions, polymorphic content, and absolute security.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.7)] transition-all duration-300 hover:-translate-y-1 group">
                Join the Network <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#architecture">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg backdrop-blur-sm bg-background/50 border-border/50 hover:bg-secondary/80 transition-all hover:-translate-y-1">
                Explore Architecture
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SCROLLING ARCHITECTURE SHOWCASE */}
      <section id="architecture" className="relative py-24 bg-zinc-50 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-24 text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Engineering Excellence</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">Complex Features, Simplified.</h3>
            <p className="text-xl text-muted-foreground">
              Scroll down to discover the highly optimized, scalable micro-architecture powering every interaction on EchoNet.
            </p>
          </div>

          <div className="space-y-32">
            
            {/* Feature 1: Real-Time */}
            <div className="grid lg:grid-cols-2 gap-16 items-center sticky top-24 pt-8 pb-16 bg-zinc-50 dark:bg-zinc-950/90 z-10 backdrop-blur-xl border-t border-border/40">
              <div className="order-2 lg:order-1">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 shadow-inner border border-blue-500/20">
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="text-3xl font-bold mb-4">Real-Time Messaging Engine</h4>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Powered by <strong className="text-foreground">Socket.io</strong> and backed by <strong className="text-foreground">Redis</strong> pub/sub mechanisms. EchoNet delivers instantaneous 1-on-1 and group chats with absolute reliability.
                </p>
                <ul className="space-y-4">
                  {[
                    "Live online presence tracking",
                    "Real-time read receipts and typing indicators",
                    "Optimized Redis caching to prevent database overload",
                    "Smart querying to exclude existing chats automatically"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2 relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 group-hover:opacity-30 blur-2xl transition-opacity duration-500 rounded-3xl"></div>
                <div className="relative rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-6 shadow-2xl overflow-hidden h-[400px] flex flex-col">
                  {/* Mock Chat UI */}
                  <div className="flex items-center gap-4 border-b border-border/50 pb-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Engineering Team</div>
                      <div className="text-xs text-blue-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> 5 online</div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 flex flex-col justify-end">
                    <div className="bg-secondary/50 p-3 rounded-2xl rounded-tl-sm w-[80%] text-sm border border-border/50 text-foreground">Did the Redis cache fix the N+1 issue?</div>
                    <div className="bg-blue-500/10 p-3 rounded-2xl rounded-tr-sm w-[80%] self-end text-sm border border-blue-500/20 text-foreground">Yes! Gateway dependencies are resolved and latency is down by 40%. 🚀</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Polymorphic */}
            <div className="grid lg:grid-cols-2 gap-16 items-center sticky top-32 pt-8 pb-16 bg-zinc-50 dark:bg-zinc-950/90 z-20 backdrop-blur-xl border-t border-border/40">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 group-hover:opacity-30 blur-2xl transition-opacity duration-500 rounded-3xl"></div>
                <div className="relative rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-6 shadow-2xl overflow-hidden h-[400px] flex items-center justify-center">
                  <div className="relative w-full max-w-sm">
                    {/* Mock Thread UI */}
                    <div className="bg-secondary/30 p-4 rounded-xl border border-border/50 mb-4 shadow-sm">
                      <div className="font-semibold text-sm mb-2 text-foreground">Original Post</div>
                      <div className="text-xs text-muted-foreground">Just shipped the new polymorphic likes feature!</div>
                    </div>
                    <div className="ml-8 border-l-2 border-border/50 pl-4 space-y-4">
                      <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20 text-sm shadow-sm relative text-foreground">
                        <div className="absolute -left-4 top-4 w-4 h-[2px] bg-border/50"></div>
                        <span className="font-medium text-purple-500">Comment:</span> This architecture is insane!
                      </div>
                      <div className="ml-8 border-l-2 border-border/50 pl-4">
                        <div className="bg-secondary/30 p-3 rounded-xl border border-border/50 text-sm shadow-sm relative text-foreground">
                          <div className="absolute -left-4 top-4 w-4 h-[2px] bg-border/50"></div>
                          <span className="font-medium text-primary">Reply:</span> Wait until you see the Reels integration.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 shadow-inner border border-purple-500/20">
                  <Layers className="w-8 h-8 text-purple-500" />
                </div>
                <h4 className="text-3xl font-bold mb-4">Polymorphic Social Graph</h4>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  A deeply relational database design utilizing <strong className="text-foreground">Prisma ORM</strong> and <strong className="text-foreground">PostgreSQL</strong>. We handle complex data relationships seamlessly across the entire platform.
                </p>
                <ul className="space-y-4">
                  {[
                    "Deeply nested threaded comments and replies",
                    "Unified interactions (Likes/Saves) across Posts, Reels, and Stories",
                    "Highly optimized queries to prevent UI rendering bottlenecks",
                    "Scalable schema design for future content types"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3: Background Tasks */}
            <div className="grid lg:grid-cols-2 gap-16 items-center sticky top-40 pt-8 pb-16 bg-zinc-50 dark:bg-zinc-950/90 z-30 backdrop-blur-xl border-t border-border/40">
              <div className="order-2 lg:order-1">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 shadow-inner border border-orange-500/20">
                  <Cpu className="w-8 h-8 text-orange-500" />
                </div>
                <h4 className="text-3xl font-bold mb-4">Asynchronous Processing</h4>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Heavy lifting like media uploads start async jobs in <strong className="text-foreground">BullMQ</strong> as Flow Producers. The frontend regularly polls job statuses to offer real-time feedback and retry capabilities.
                </p>
                <ul className="space-y-4">
                  {[
                    "Non-blocking high-resolution media uploads",
                    "Ephemeral stories lifecycle management (24h auto-deletion)",
                    "Background email dispatch for notifications and OTPs",
                    "Job retries and failure handling via Redis queues"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2 relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-red-500 opacity-20 group-hover:opacity-30 blur-2xl transition-opacity duration-500 rounded-3xl"></div>
                <div className="relative rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-6 shadow-2xl overflow-hidden h-[400px] flex flex-col justify-center gap-6">
                  {/* Mock Queue Table UI */}
                  <div className="w-full bg-background/80 rounded-xl border border-border/50 shadow-sm overflow-hidden flex flex-col h-full max-h-[300px]">
                    <div className="bg-secondary/50 px-4 py-3 border-b border-border/50 flex justify-between items-center">
                       <span className="font-semibold text-sm text-foreground">Background Jobs Table</span>
                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Loader2 className="w-3 h-3 text-blue-500 animate-spin" /> Polling...
                       </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                      {[
                        { id: 'bullmq-job-9382', name: 'Process_HighRes_Post', status: 'Completed', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
                        { id: 'bullmq-job-9383', name: 'Transcode_Reel_Video', status: 'Pending', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', isPending: true },
                        { id: 'bullmq-job-9384', name: 'Upload_Story_Media', status: 'Failed', color: 'bg-red-500/10 text-red-500 border-red-500/20', isFailed: true },
                      ].map((job, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/40 text-sm">
                           <div className="flex flex-col gap-1">
                              <div className="font-medium text-foreground">{job.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">{job.id}</div>
                           </div>
                           <div className="flex items-center gap-3">
                              <Badge variant="outline" className={`${job.color} text-xs font-normal border`}>
                                 {job.isPending && <Loader2 className="animate-spin -ml-1 mr-2 h-3 w-3 inline" />}
                                 {job.status}
                              </Badge>
                              {job.isFailed && (
                                 <button className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer">
                                    <RotateCcw className="w-3 h-3" /> Retry
                                 </button>
                              )}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Security */}
            <div className="grid lg:grid-cols-2 gap-16 items-center sticky top-48 pt-8 pb-16 bg-zinc-50 dark:bg-zinc-950/90 z-40 backdrop-blur-xl border-t border-border/40">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-emerald-500 opacity-20 group-hover:opacity-30 blur-2xl transition-opacity duration-500 rounded-3xl"></div>
                <div className="relative rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-6 shadow-2xl overflow-hidden h-[400px] flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
                     <div className="col-span-2 bg-secondary/30 rounded-xl border border-border/50 flex flex-col items-center justify-center gap-2 p-4 shadow-sm relative overflow-hidden">
                        <Lock className="w-8 h-8 text-green-500 mb-2" />
                        <div className="font-bold text-foreground">Authentication Domain</div>
                        <div className="text-xs text-muted-foreground text-center">Stateless JWTs & Secure HttpOnly Cookies</div>
                     </div>
                     <div className="col-span-1 bg-green-500/10 rounded-xl border border-green-500/20 flex flex-col items-center justify-center gap-2 p-4 shadow-sm">
                        <div className="text-2xl font-bold text-green-500">OTP</div>
                        <div className="text-xs text-muted-foreground text-center">Nodemailer Verification</div>
                     </div>
                     <div className="col-span-1 bg-secondary/30 rounded-xl border border-border/50 flex flex-col items-center justify-center gap-2 p-4 shadow-sm">
                        <div className="text-2xl font-bold text-foreground">User Profile</div>
                        <div className="text-xs text-muted-foreground text-center">Strict Domain Separation</div>
                     </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 shadow-inner border border-green-500/20">
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-3xl font-bold mb-4">Enterprise-Grade Security</h4>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Security isn't an afterthought. We implement a strict separation of concerns between Authentication (User data) and Social (Profile data) domains.
                </p>
                <ul className="space-y-4">
                  {[
                    "Hybrid stateless JWTs and stateful Redis sessions",
                    "Robust Nodemailer OTP flows for secure password resets",
                    "Comprehensive error handling bound to React Query mutations",
                    "Strict role-based access control (RBAC) across API endpoints"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. TECH STACK BENTO */}
      <section className="py-32 bg-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[500px] bg-primary/5 blur-[100px] rounded-[100%] pointer-events-none"></div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-sm font-bold leading-8 tracking-widest text-primary uppercase mb-16">
            The Technology Stack
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
            <div className="bg-secondary/40 border border-border/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 hover:bg-secondary/60 hover:shadow-xl hover:shadow-red-500/10 hover:border-red-500/30 group">
              <Server className="w-12 h-12 text-[#E0234E] group-hover:animate-bounce" />
              <div className="text-center">
                <span className="font-bold text-lg block text-foreground">NestJS v11</span>
                <span className="text-xs text-muted-foreground block mt-1">Backend Framework</span>
              </div>
            </div>
            
            <div className="bg-secondary/40 border border-border/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 hover:bg-secondary/60 hover:shadow-xl hover:shadow-foreground/10 hover:border-foreground/30 group">
              <Smartphone className="w-12 h-12 text-foreground group-hover:-rotate-12 transition-transform duration-300" />
              <div className="text-center">
                <span className="font-bold text-lg block text-foreground">Next.js 16</span>
                <span className="text-xs text-muted-foreground block mt-1">App Router UI</span>
              </div>
            </div>
            
            <div className="bg-secondary/40 border border-border/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 hover:bg-secondary/60 hover:shadow-xl hover:shadow-blue-500/10 hover:border-[#316192]/30 group">
              <Database className="w-12 h-12 text-[#316192] group-hover:animate-pulse" />
              <div className="text-center">
                <span className="font-bold text-lg block text-foreground">PostgreSQL</span>
                <span className="text-xs text-muted-foreground block mt-1">Prisma ORM Engine</span>
              </div>
            </div>
            
            <div className="bg-secondary/40 border border-border/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 hover:bg-secondary/60 hover:shadow-xl hover:shadow-red-500/10 hover:border-[#DC382D]/30 group">
              <InfinityIcon className="w-12 h-12 text-[#DC382D] group-hover:animate-[spin_3s_linear_infinite]" />
              <div className="text-center">
                <span className="font-bold text-lg block text-foreground">Redis & BullMQ</span>
                <span className="text-xs text-muted-foreground block mt-1">Cache & Queues</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER CTA */}
      <section className="relative isolate overflow-hidden bg-zinc-950 border-t border-border/40 py-32">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center relative z-10">
          <Globe className="w-16 h-16 mx-auto mb-8 text-primary opacity-80" />
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Ready to jump in?
          </h2>
          <p className="mx-auto text-xl leading-8 text-zinc-400 mb-12">
            Join developers and creators worldwide using EchoNet. Experience the speed, reliability, and beautiful architecture of a modern tech stack.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-12 py-7 text-xl font-bold hover:scale-105 transition-all shadow-[0_0_30px_-5px_rgba(var(--primary),0.6)] text-white">
                Create an Account
              </Button>
            </Link>
            <p className="text-sm text-zinc-500 mt-4 sm:mt-0 sm:ml-4">
              Free to join. No credit card required.
            </p>
          </div>
        </div>
      </section>
      
      {/* Global CSS required for some custom animations like shimmer */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </div>
  );
}
