import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithUser } from './token-auth.guard';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly role: 'admin' | 'user') {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) return false;
    return user.role === this.role;
  }
}
