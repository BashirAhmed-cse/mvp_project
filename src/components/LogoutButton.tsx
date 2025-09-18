"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove auth status
    localStorage.removeItem("isAuthenticated");

    // This will trigger your AuthWrapper effect (storage event)
    window.dispatchEvent(new StorageEvent("storage", { key: "isAuthenticated" }));

    // Redirect to login
    router.replace("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}
