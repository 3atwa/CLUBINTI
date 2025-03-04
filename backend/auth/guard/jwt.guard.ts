import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}

//AdminGuard
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    //get the data from the incoming HTTP request, such as headers, parameters, body
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user && user.role === 'admin') {
      return true; // Allow access if user is admin
    }

    return false; // Deny access if user is not admin
  }
}

//userGuard
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    //get the data from the incoming HTTP request, such as headers, parameters, body
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user && user.role === 'user') {
      return true; // Allow access if user is user
    }

    return false; // Deny access if user is not user
  }
}
