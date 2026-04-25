"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GuidelineChatButton } from "@/components/guidelines/guideline-chat-button";
import { GuidelineChatPanel } from "@/components/guidelines/guideline-chat-panel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  BookOpen,
  ClipboardList,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Smartphone,
  UserCircle2,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workflow", label: "Assessment Workflow", icon: ClipboardList },
  { href: "/records", label: "Patient Records", icon: FolderOpen },
  { href: "/guidelines", label: "Guideline & Evidence Library", icon: BookOpen },
  { href: "/questionnaire", label: "Patient Questionnaire", icon: Smartphone },
];
const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Admin Dashboard", icon: ShieldCheck },
  { href: "/admin/doctors", label: "Doctor Management", icon: UserCircle2 },
];

function ProfileButton() {
  return (
    <Button asChild variant="ghost" size="icon-sm" aria-label="Open profile details">
      <Link href="/profile">
        <UserCircle2 className="h-5 w-5" />
      </Link>
    </Button>
  );
}

function SidebarNavigation({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex-1 space-y-1 p-3">
      {(isAdmin ? ADMIN_NAV_ITEMS : NAV_ITEMS).map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive(href)
              ? "bg-accent text-accent-foreground"
              : "text-sidebar-foreground hover:bg-accent/60"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function ClinicianShell({
  children,
  isAdmin = false,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [chatOpen, setChatOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-border bg-sidebar-background lg:flex">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div>
            <Link href={isAdmin ? "/admin" : "/dashboard"} className="text-lg font-semibold tracking-tight">
              Cephra
            </Link>
            <p className="text-xs text-muted-foreground">Clinical Prototype</p>
          </div>
          <ProfileButton />
        </div>
        <SidebarNavigation isAdmin={isAdmin} />
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-background">
        <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div>
              <Link href={isAdmin ? "/admin" : "/dashboard"} className="text-base font-semibold tracking-tight">
                Cephra
              </Link>
              <p className="text-xs text-muted-foreground">Clinical Prototype</p>
            </div>
            <ProfileButton />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0" showCloseButton={false}>
              <SheetHeader className="border-b border-border px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <SheetTitle className="text-left">
                      <Link href={isAdmin ? "/admin" : "/dashboard"} className="text-base font-semibold tracking-tight">
                        Cephra
                      </Link>
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground">Clinical Prototype</p>
                  </div>
                  <ProfileButton />
                </div>
              </SheetHeader>
              <SidebarNavigation isAdmin={isAdmin} />
              <div className="border-t border-border p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-muted-foreground"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        {children}
      </main>

      <GuidelineChatButton
        onClick={() => setChatOpen(true)}
        isOpen={chatOpen}
      />
      <GuidelineChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
}
