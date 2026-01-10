"use client";

import { useRouter } from "next/navigation";
import React from "react";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth_token"); // remove JWT
    router.push("/admin/login");           // redirect to login
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
