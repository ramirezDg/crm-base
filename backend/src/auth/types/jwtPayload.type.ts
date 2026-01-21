export type JwtPayload = {
  name: string;
  sub: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  permissions?: string[];
};
