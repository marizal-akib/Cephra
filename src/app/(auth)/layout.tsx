export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] p-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
