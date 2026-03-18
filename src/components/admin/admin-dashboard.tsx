"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  MoreHorizontal,
  ShieldCheck,
  UserX,
  UserCheck,
  Trash2,
  RefreshCw,
  Pencil,
  KeyRound,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

type AdminUser = {
  id: string;
  full_name: string;
  credentials: string | null;
  specialty: string | null;
  role: "admin" | "doctor";
  created_at: string;
  email: string | null;
  last_sign_in_at: string | null;
  banned: boolean;
};

export function AdminDashboard({
  title = "Admin Dashboard",
  subtitle = "Manage doctor accounts and system access",
}: {
  title?: string;
  subtitle?: string;
}) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load users.");
      setUsers(data.users ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleToggleBan(user: AdminUser) {
    const action = user.banned ? "unban" : "ban";
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(
        user.banned ? `${user.full_name} has been reactivated.` : `${user.full_name} has been deactivated.`
      );
      await loadUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`${deleteTarget.full_name} has been removed.`);
      setDeleteTarget(null);
      await loadUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  async function saveDoctorEdit(payload: {
    id: string;
    full_name: string;
    credentials: string;
    specialty: string;
  }) {
    const res = await fetch(`/api/admin/users/${payload.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: payload.full_name,
        credentials: payload.credentials || null,
        specialty: payload.specialty || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update doctor.");
  }

  const doctors = users.filter((u) => u.role === "doctor");
  const admins = users.filter((u) => u.role === "admin");

  return (
    <div className="flex flex-col min-h-full">
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Create Doctor Account
            </Button>
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Invite Doctor
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="py-4">
            <CardContent className="flex flex-col gap-0.5">
              <p className="text-2xl font-semibold tabular-nums">{users.length}</p>
              <p className="text-xs text-muted-foreground">Total Accounts</p>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent className="flex flex-col gap-0.5">
              <p className="text-2xl font-semibold tabular-nums">{doctors.filter((u) => !u.banned).length}</p>
              <p className="text-xs text-muted-foreground">Active Doctors</p>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent className="flex flex-col gap-0.5">
              <p className="text-2xl font-semibold tabular-nums">{users.filter((u) => u.banned).length}</p>
              <p className="text-xs text-muted-foreground">Deactivated</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin accounts */}
        {admins.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                Admin Account
              </CardTitle>
              <CardDescription>System administrator with full access</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {admins.map((u) => (
                <UserRow key={u.id} user={u} isAdminRow />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Doctor management */}
        <Card id="doctor-management">
          <CardHeader>
            <CardTitle className="text-base">Doctor Management</CardTitle>
            <CardDescription>
              {doctors.length === 0
                ? "No doctor accounts yet. Invite a doctor to get started."
                : `${doctors.length} doctor account${doctors.length !== 1 ? "s" : ""}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Loading accounts...
              </div>
            ) : doctors.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground mb-3">No doctor accounts yet.</p>
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  <UserPlus className="h-4 w-4" />
                  Create Doctor Account
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {doctors.map((u) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    onToggleBan={() => handleToggleBan(u)}
                    onDelete={() => setDeleteTarget(u)}
                    onEdit={() => setEditTarget(u)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invite dialog */}
      {createOpen && (
        <CreateDoctorDialog
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setCreateOpen(false);
            loadUsers();
          }}
        />
      )}

      {/* Invite dialog */}
      {inviteOpen && (
        <InviteDialog
          onClose={() => setInviteOpen(false)}
          onSuccess={() => {
            setInviteOpen(false);
            loadUsers();
          }}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <Dialog open onOpenChange={(o) => !o && setDeleteTarget(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Remove account?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This will permanently delete{" "}
              <strong>{deleteTarget.full_name}</strong>&apos;s account and cannot
              be undone. Their patient data and assessments will remain.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Removing..." : "Remove account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit doctor dialog */}
      {editTarget && (
        <EditDoctorDialog
          user={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={async (payload) => {
            try {
              await saveDoctorEdit(payload);
              toast.success("Doctor account updated.");
              setEditTarget(null);
              await loadUsers();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Update failed.");
            }
          }}
        />
      )}
    </div>
  );
}

function CreateDoctorDialog({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [credentials, setCredentials] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          full_name: fullName,
          password,
          credentials,
          specialty,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account.");
      toast.success(`Doctor account created for ${email}`);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Doctor Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="create-name">Full Name</Label>
            <Input
              id="create-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Dr. Jane Smith"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="create-email">Email address</Label>
            <Input
              id="create-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@example.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="create-password">Temporary Password</Label>
            <Input
              id="create-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="create-credentials">Credentials (optional)</Label>
            <Input
              id="create-credentials"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              placeholder="MD, DO, NP"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="create-specialty">Specialty (optional)</Label>
            <Input
              id="create-specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Neurology"
            />
          </div>
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UserRow({
  user,
  isAdminRow = false,
  onToggleBan,
  onDelete,
  onEdit,
}: {
  user: AdminUser;
  isAdminRow?: boolean;
  onToggleBan?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium truncate">{user.full_name || "—"}</p>
          {user.banned && (
            <Badge variant="secondary" className="text-xs bg-rose-50 text-rose-700 border-rose-200">
              Deactivated
            </Badge>
          )}
          {user.role === "admin" && (
            <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
              Admin
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {user.email ?? "No email"}
          {user.credentials && <> · {user.credentials}</>}
          {user.specialty && <> · {user.specialty}</>}
        </p>
        <p className="text-xs text-muted-foreground">
          Joined {formatDate(user.created_at)}
          {user.last_sign_in_at && (
            <> · Last sign in {formatDate(user.last_sign_in_at)}</>
          )}
        </p>
      </div>

      {!isAdminRow && onToggleBan && onDelete && onEdit && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-4 w-4" />
              Edit account
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <KeyRound className="h-4 w-4" />
              Reset access (soon)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.banned ? (
              <DropdownMenuItem onClick={onToggleBan}>
                <UserCheck className="h-4 w-4 text-emerald-600" />
                Reactivate account
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={onToggleBan}>
                <UserX className="h-4 w-4 text-amber-600" />
                Deactivate account
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Remove account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

function EditDoctorDialog({
  user,
  onClose,
  onSave,
}: {
  user: AdminUser;
  onClose: () => void;
  onSave: (payload: {
    id: string;
    full_name: string;
    credentials: string;
    specialty: string;
  }) => Promise<void>;
}) {
  const [fullName, setFullName] = useState(user.full_name ?? "");
  const [credentials, setCredentials] = useState(user.credentials ?? "");
  const [specialty, setSpecialty] = useState(user.specialty ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSave({
        id: user.id,
        full_name: fullName.trim(),
        credentials: credentials.trim(),
        specialty: specialty.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Doctor Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Full Name</Label>
            <Input
              id="edit-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-credentials">Credentials</Label>
            <Input
              id="edit-credentials"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              placeholder="MD, DO, NP"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-specialty">Specialty</Label>
            <Input
              id="edit-specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Neurology"
            />
          </div>
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function InviteDialog({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, full_name: fullName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send invite.");
      toast.success(`Invite sent to ${email}`);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invite.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Invite Doctor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="invite-name">Full Name</Label>
            <Input
              id="invite-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Dr. Jane Smith"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@example.com"
              required
            />
          </div>
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
