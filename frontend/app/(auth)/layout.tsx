export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen background flex flex-col items-center justify-center px-4 selection:foreground gap-8">
      <h1 className="text-5xl font-bold text-white tracking-tight">Echonet</h1>
      {children}
    </div>
  );
}
