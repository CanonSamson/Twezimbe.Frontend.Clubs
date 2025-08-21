import { hasBfPermission, PermissionRole, User } from './bf-abac'

export type Route = {
  title: string
  href: string
  baseRoute: boolean
  permission: {
    resource: keyof Permissions
    action: string // e.g., "view", "create", "update"
    data?: any // Optional data for dynamic permission checks
  }
}

export function canAccessRoute (
  user: User,
  permissionRoles: PermissionRole[],
  route: Route
): boolean {
  const { resource, action, data } = route.permission
  return hasBfPermission(user, permissionRoles, resource as any, action, data)
}
