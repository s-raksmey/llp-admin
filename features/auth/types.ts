export type AuthSession = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
  };
};
