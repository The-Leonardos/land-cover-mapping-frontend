export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto border-2 border-red-500">
      {children}
    </div>
  );
}
