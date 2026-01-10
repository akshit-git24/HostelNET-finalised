"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import StudentHeader from "@/components/StudentHeader";
// import UniversityHeader from "@/components/UniversityHeader";
// import AdminHeader from "@/components/AdminHeader";
import DefaultHeader from "@/components/DefaultHeader";

const Header = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      // Decode JWT payload manually
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      setRole(payload.role || null);
    } catch (err) {
      console.error("Invalid token", err);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // if (loading) return <div>Loading...</div>;

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    router.push('/login'); // Or home '/'
  };

  // Render view based on role
  // Use DefaultHeader for everyone, passing the role
  return <DefaultHeader role={role} onLogout={handleLogout} />;
};

export default Header;
