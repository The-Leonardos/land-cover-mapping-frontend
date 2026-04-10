export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto">
      {children}
    </div>
  );
}
