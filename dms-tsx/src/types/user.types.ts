export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  phone: string;
  department: string;
  designation: string;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  isActive: boolean;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  passwordChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}