export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-start pt-20 px-4 selection:bg-primary selection:text-primary-foreground gap-10">
      <h1 className="text-6xl font-bold text-white tracking-tighter">
        Echonet
      </h1>
      {children}
    </div>
  );
}
