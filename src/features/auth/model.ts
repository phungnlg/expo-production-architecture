/** Auth domain types. The session is what the rest of the app gates on. */
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface Session {
  token: string;
  user: User;
}

export interface UserDTO {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export function toUser(dto: UserDTO): User {
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.full_name,
    role: dto.role,
  };
}
