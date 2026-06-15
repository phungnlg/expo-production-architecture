import { ApiClient } from '@/api/client';
import { ok, Result } from '@/lib/result';
import { Session, toUser, UserDTO } from './model';

interface LoginResponseDTO {
  token: string;
  user: UserDTO;
}

/** Auth data source. Maps the login DTO into a domain Session. */
export class AuthApi {
  constructor(private readonly client: ApiClient) {}

  async login(email: string, password: string): Promise<Result<Session>> {
    const res = await this.client.request<LoginResponseDTO>('/auth/login', {
      method: 'POST',
      body: { email, password },
      retries: 0,
    });
    if (!res.ok) return res;
    return ok({ token: res.value.token, user: toUser(res.value.user) });
  }
}
