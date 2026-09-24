"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ShieldCheck, Trash2, UserRound, XCircle } from "lucide-react";

import { useAuth } from "@/context/auth";
import { changePassword, deleteAccount, updateMe } from "@/services/api";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ProfilePageClient({ initialUser }) {
  const { updateUser, logout } = useAuth();
  const router = useRouter();
  const deleteModalRef = useRef(null);

  const [profile, setProfile] = useState(initialUser);
  const [username, setUsername] = useState(initialUser.username);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [deletePassword, setDeletePassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const createdAt = profile?.createdAt
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(profile.createdAt))
    : "-";

  // update username
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setSavingProfile(true);

    try {
      const data = await updateMe({ username });
      setProfile(data.user);
      updateUser({
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
      });
      toast.add({
        type: "success",
        description: data.message || "Profile updated successfully.",
      });
    } catch (err) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const data = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm(emptyPasswordForm);
      toast.add({
        type: "success",
        description: data.message || "Password updated successfully.",
      });
    } catch (err) {
      setPasswordError(err.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  // delete account
  const openDeleteModal = () => {
    setDeletePassword("");
    setDeleteError("");
    document.activeElement?.blur();
    deleteModalRef.current?.showModal();
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError("");
    setDeleting(true);

    try {
      await deleteAccount({ password: deletePassword });
      toast.add({
        type: "success",
        description: "Account deleted successfully.",
      });
      await logout();
      router.replace("/register");
    } catch (err) {
      setDeleteError(err.message || "Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-4xl space-y-5">
        <header>
          <h2 className="text-2xl font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your account details and security.</p>
        </header>

        {/* Profile Info */}
        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <UserRound size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium">Profile Info</h3>
              <p className="text-sm text-muted-foreground">Update your username and review account status.</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="profile-username" className="text-xs font-medium">
                Username
              </label>
              <Input id="profile-username" value={username} onChange={(e) => setUsername(e.target.value)} className="h-10 rounded-xl focus-visible:ring-0 focus-visible:border-primary" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Email</label>
              <div aria-label="Email (cannot be changed)" className="flex h-10 items-center rounded-xl border border-input bg-transparent px-3 text-sm text-muted-foreground select-text">
                {profile?.email || ""}
              </div>
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center gap-2 text-sm">
              {profile?.isVerified ? (
                <Badge variant="secondary" className="gap-1 rounded-lg bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300">
                  <CheckCircle size={14} />
                  Email verified
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1 rounded-lg">
                  <XCircle size={14} />
                  Email not verified
                </Badge>
              )}
              <Badge variant="secondary" className="rounded-lg">
                Joined {createdAt}
              </Badge>
            </div>

            {profileError && <p className="md:col-span-2 text-sm text-destructive">{profileError}</p>}

            <div className="md:col-span-2">
              <Button type="submit" size="sm" className="rounded-xl cursor-pointer" disabled={savingProfile}>
                {savingProfile ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : "Save profile"}
              </Button>
            </div>
          </form>
        </section>

        {/* Security */}
        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium">Security</h3>
              <p className="text-sm text-muted-foreground">Change your password using your current password.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Current Password</label>
              <Input
                type="password"
                placeholder="Current password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                required
                className="h-10 rounded-xl focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">New Password</label>
              <Input
                type="password"
                placeholder="New password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                required
                className="h-10 rounded-xl focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Confirm New Password</label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className="h-10 rounded-xl focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>

            {passwordError && <p className="md:col-span-3 text-sm text-destructive">{passwordError}</p>}

            <div className="md:col-span-3">
              <Button type="submit" size="sm" className="rounded-xl cursor-pointer" disabled={savingPassword}>
                {savingPassword ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : "Update password"}
              </Button>
            </div>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="bg-card border border-destructive/20 rounded-xl p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="font-medium text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">Delete your account and all job applications permanently.</p>
              </div>
            </div>
            <Button type="button" variant="destructive" size="sm" onClick={openDeleteModal} className="rounded-xl cursor-pointer">
              Delete account
            </Button>
          </div>
        </section>
      </div>

      {/* Delete Modal */}
      <dialog ref={deleteModalRef} className="m-auto rounded-2xl bg-transparent p-0 backdrop:bg-black/50">
        <div className="mx-4 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-border bg-card p-6 shadow-none">
          <h3 className="text-base font-medium text-destructive">Delete account?</h3>
          <p className="text-sm text-muted-foreground mt-1">This permanently deletes your profile and all job applications.</p>

          <form onSubmit={handleDeleteAccount} className="mt-5 space-y-3">
            <Input
              type="password"
              placeholder="Enter your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              required
              autoFocus
              className="h-10 rounded-xl focus-visible:ring-0 focus-visible:border-primary"
            />
            {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={() => deleteModalRef.current?.close()} disabled={deleting} className="w-full rounded-xl sm:w-auto cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" variant="destructive" size="sm" disabled={deleting} className="w-full rounded-xl shadow-none sm:w-auto cursor-pointer">
                {deleting ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : "Delete account"}
              </Button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}