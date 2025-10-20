import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { RequestWithUser } from './token-auth.guard';

export const RoleGuard = (role: 'admin' | 'user'): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      if (!user) return false;
      return user.role === role;
    }
  }

  return mixin(RoleGuardMixin);
};
