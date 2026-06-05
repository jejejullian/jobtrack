import { useEffect, useRef, useState } from "react";
import { CheckCircle, ShieldCheck, Trash2, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { changePassword, deleteAccount, getMe, updateMe } from "../services/api";

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const inputClass = "w-full h-10 rounded-xl border border-base-300 bg-base-100 px-3 text-sm outline-none focus:border-primary";
const inputReadonlyClass = "w-full h-10 rounded-xl border border-base-300 bg-base-100 px-3 text-sm outline-none cursor-default opacity-60";

export default function ProfilePage() {
  const { token, user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const deleteModalRef = useRef(null);

  const [profile, setProfile] = useState(user);
  const [username, setUsername] = useState(user?.username || "");
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getMe(token);
        setProfile(data.user);
        setUsername(data.user.username);
        updateUser({
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
        });
      } catch (err) {
        toast.error(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, updateUser]);

  const createdAt = profile?.createdAt
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(profile.createdAt))
    : "-";

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setSavingProfile(true);

    try {
      const data = await updateMe(token, { username });
      setProfile(data.user);
      updateUser({
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
      });
      toast.success(data.message || "Profile updated successfully.");
    } catch (err) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const data = await changePassword(token, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm(emptyPasswordForm);
      toast.success(data.message || "Password updated successfully.");
    } catch (err) {
      setPasswordError(err.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

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
      await deleteAccount(token, { password: deletePassword });
      toast.success("Account deleted successfully.");
      logout();
      navigate("/register", { replace: true });
    } catch (err) {
      setDeleteError(err.message || "Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-4xl space-y-5">
        <header>
          <h2 className="text-2xl font-semibold">Profile</h2>
          <p className="text-sm text-base-content/60 mt-1">Manage your account details and security.</p>
        </header>

        {/* Profile Info */}
        <section className="bg-base-100 border border-base-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <UserRound size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium">Profile Info</h3>
              <p className="text-sm text-base-content/50">Update your username and review account status.</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="profile-username" className="text-xs font-medium">
                Username
              </label>
              <input
                id="profile-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="profile-email" className="text-xs font-medium">
                Email
              </label>
              <input
                id="profile-email"
                value={profile?.email || ""}
                readOnly
                className={inputReadonlyClass}
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="badge badge-success gap-1 rounded-lg">
                <CheckCircle size={14} />
                {profile?.isVerified ? "Email verified" : "Email not verified"}
              </span>
              <span className="badge badge-ghost rounded-lg">Joined {createdAt}</span>
            </div>

            {profileError && <p className="md:col-span-2 text-sm text-error">{profileError}</p>}

            <div className="md:col-span-2">
              <button type="submit" className="btn btn-primary btn-sm rounded-xl shadow-none" disabled={savingProfile}>
                {savingProfile ? <span className="loading loading-spinner loading-xs" /> : "Save profile"}
              </button>
            </div>
          </form>
        </section>

        {/* Security */}
        <section className="bg-base-100 border border-base-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 text-info flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium">Security</h3>
              <p className="text-sm text-base-content/50">Change your password using your current password.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Current Password</label>
              <input
                type="password"
                placeholder="Current password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">New Password</label>
              <input
                type="password"
                placeholder="New password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className={inputClass}
              />
            </div>

            {passwordError && <p className="md:col-span-3 text-sm text-error">{passwordError}</p>}

            <div className="md:col-span-3">
              <button type="submit" className="btn btn-primary btn-sm rounded-xl shadow-none" disabled={savingPassword}>
                {savingPassword ? <span className="loading loading-spinner loading-xs" /> : "Update password"}
              </button>
            </div>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="bg-base-100 border border-error/20 rounded-xl p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-error/10 text-error flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="font-medium text-error">Danger Zone</h3>
                <p className="text-sm text-base-content/50">Delete your account and all job applications permanently.</p>
              </div>
            </div>
            <button type="button" onClick={openDeleteModal} className="btn btn-error btn-sm rounded-xl shadow-none text-base-100">
              Delete account
            </button>
          </div>
        </section>
      </div>

      {/* Delete Modal */}
      <dialog ref={deleteModalRef} className="modal">
        <div className="modal-box mx-4 w-[calc(100%-2rem)] max-w-sm rounded-2xl shadow-none border border-base-200">
          <h3 className="font-medium text-base text-error">Delete account?</h3>
          <p className="text-sm text-base-content/60 mt-1">This permanently deletes your profile and all job applications.</p>

          <form onSubmit={handleDeleteAccount} className="mt-5 space-y-3">
            <input
              type="password"
              placeholder="Enter your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              required
              className={inputClass}
            />
            {deleteError && <p className="text-sm text-error">{deleteError}</p>}

            <div className="modal-action mt-5 flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                className="btn btn-ghost btn-sm rounded-xl"
                onClick={() => deleteModalRef.current?.close()}
                disabled={deleting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-error btn-sm rounded-xl shadow-none text-base-100" disabled={deleting}>
                {deleting ? <span className="loading loading-spinner loading-xs" /> : "Delete account"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}