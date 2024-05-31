"use client";

import React, { useState, useEffect } from "react";
import { supabase, supabaseAdmin } from "../utils/supabase";
import { useRouter } from "next/navigation";
import { UserContext } from "./UserContext";
import { LoadingScreenFullScreen } from "@/components/LoadingScreen";

type User = any;

const Protected = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error && error.status === 401) {
          router.push("/");
        } else if (error) {
          console.error("Error fetching user:", error.message);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (user) {
      const checkRole = async () => {
        const { data } = await supabaseAdmin
          .from("UserLists")
          .select("id, first_name, last_name, role")
          .eq("id", user.id);

        if (data && data.length > 0) {
          // console.log("data", data[0]);
          const name = `${data[0].first_name} ${data[0].last_name}`;
          setUserName(name);
          setUserId(user.id);
          setUserRole(data[0].role);

          if (data[0].role === "personnel") {
            router.push("/personnel/dashboard/dashboard");
          } else if (data[0].role === "passenger") {
            router.push("/passenger/dashboard");
          } else if (data[0].role === "enforcer") {
            router.push("/enforcer/dashboard");
          }

          return;
        } else {
          setUserName("Admin");
          setUserId(user.id);
          router.push("/admin/dashboard/dashboard");
        }
        return;
      };

      checkRole();
    }
  }, [user, router]);

  if (loading) {
    return <LoadingScreenFullScreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        userName,
        userId,
        userRole,
        setUserName,
        setUserId,
        setUserRole,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export default Protected;
