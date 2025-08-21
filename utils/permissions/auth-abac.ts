import { GroupRole } from '@/types/groups'

type Role = 'OWNER' | 'ADMIN' | 'USER'
type User = { blockedBy: string[]; roles: Role[] | GroupRole[]; id: string }

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]['dataType']) => boolean)

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]['action']]: PermissionCheck<Key>
    }>
  }>
}

type Permissions = {
  bfs: {
    dataType: {
      groupId: string
    }
    action: 'view' | 'create' | 'update'
  }
  clubs: {
    dataType: {
      groupId: string
    }
    action: 'view' | 'create' | 'update'
  }
  crowdfunding: {
    dataType: {
      groupId: string
    }
    action: 'view' | 'create' | 'update'
  }
  [`group-invitations`]: {
    dataType: { groupId: string }
    action: 'view' | 'create' | 'update'
  }
  [`delete-group`]: {
    dataType: { groupId: string }
    action: 'view' | 'create' | 'update'
  }
  [`group-details`]: {
    dataType: { groupId: string }
    action: 'view' | 'create' | 'update'
  }
}

const ROLES = {
  ADMIN: {
    bfs: {
      view: true,
      create: true,
      update: true
    },
    clubs: {
      view: true,
      create: true,
      update: true
    },
    crowdfunding: {
      view: true,
      create: true,
      update: true
    },
    [`group-invitations`]: {
      view: true,
      create: true,
      update: true
    },
    [`delete-group`]: {
      view: true,
      create: true,
      update: true
    },
    [`group-details`]: {
      view: true,
      create: true,
      update: true
    }
  },
  OWNER: {
    bfs: {
      view: true,
      create: true,
      update: true
    },
    clubs: {
      view: true,
      create: true,
      update: true
    },
    crowdfunding: {
      view: true,
      create: true,
      update: true
    },
    [`group-invitations`]: {
      view: true,
      create: true,
      update: true
    },
    [`delete-group`]: {
      view: true,
      create: true,
      update: true
    },
    [`group-details`]: {
      view: true,
      create: true,
      update: true
    }
  },

  USER: {
    bfs: {
      view: true,
      create: false,
      update: false
    },
    clubs: {
      view: true,
      create: false,
      update: false
    },
    crowdfunding: {
      view: true,
      create: false,
      update: false
    },
    [`group-invitations`]: {
      view: false,
      create: false,
      update: false
    },
    [`delete-group`]: {
      view: false,
      create: false,
      update: false
    },
    [`group-details`]: {
      view: false,
      create: false,
      update: false
    }
  }
} as const as RolesWithPermissions

export function hasPermission<Resource extends keyof Permissions> (
  user: User,
  resource: Resource,
  action: Permissions[Resource]['action'],
  data?: Permissions[Resource]['dataType']
) {
  return user.roles.some(role => {
    // Check if the role exists in ROLES
    if (!(role in ROLES)) return false

    // Check if the resource exists for this role
    const resourcePermissions = ROLES[role as keyof typeof ROLES][resource]
    if (!resourcePermissions) return false

    // Check if the action exists for this resource
    const permission = resourcePermissions[action]
    if (permission == null) return false

    if (typeof permission === 'boolean') return permission
    return (
      data != null &&
      (
        permission as (
          user: User,
          data: Permissions[Resource]['dataType']
        ) => boolean
      )(user, data)
    )
  })
}
