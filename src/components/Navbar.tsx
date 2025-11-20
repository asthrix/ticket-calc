import Link from "next/link";
import { TrainFront } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <TrainFront className="h-6 w-6" />
          <span>Ticket Calc</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
