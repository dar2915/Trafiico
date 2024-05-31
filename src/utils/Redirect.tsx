"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "./supabase";
import { LoadingScreenFullScreen } from "@/components/LoadingScreen";

type User = any;

const Redirect = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase.auth.getUser();

        if (error && error.status === 401) {
          console.error("User is not authenticated.");
        } else if (error) {
          console.error("Error fetching user:", error.message);
        } else if (
          (data &&
            (pathname === "/admin/signin" ||
              pathname === "/passenger/signin")) ||
          pathname === "/report" ||
          pathname === "/passenger/signup"
        ) {
          // User is already logged in and is on the '/signin' route, redirect to '/dashboard'
          setUser(data.user);
          //   router.push("/dashboard");
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
      // finally {
      //   setLoading(false);
      // }
    };

    fetchData();
  }, [pathname]);

  useEffect(() => {
    setLoading(true);

    if (user) {
      const checkRole = async () => {
        const { data } = await supabase
          .from("UserLists")
          .select("id, first_name, last_name, role")
          .eq("id", user.id);

        if (data && data.length > 0) {
          if (data[0].role === "personnel") {
            router.push("/personnel/dashboard/dashboard");
          } else if (data[0].role === "passenger") {
            router.push("/passenger/dashboard");
          } else if (data[0].role === "enforcer") {
            router.push("/enforcer/dashboard");
          }

          return;
        } else {
          router.push("/admin/dashboard/dashboard");
        }
        return;
      };

      checkRole();
    }
    setLoading(false);
  }, [user, pathname]);

  if (loading) {
    return <LoadingScreenFullScreen />;
  }

  if (!user) {
    return <>{children}</>;
  }
};

export default Redirect;
