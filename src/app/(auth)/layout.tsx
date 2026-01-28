// Auth layout for login/signup pages
// Minimal layout with centered content, no header/footer

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--color-gray-50)] flex items-center justify-center p-4">
      {children}
    </main>
  );
}
