export interface JwtPayload {
  sub: number; // user.id
  email: string;
  fullName: string;
  roleId: number;
  roleName: string;
}
