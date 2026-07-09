export type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  disabled: boolean;
};
