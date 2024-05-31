import { createContext } from "react";

export const UserContext = createContext({
  userName: "",
  userId: "",
  userRole: "unauthenticated",
  setUserName: (name: string) => {},
  setUserId: (id: string) => {},
  setUserRole: (role: string) => {},
});
