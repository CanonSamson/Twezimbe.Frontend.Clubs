export type Role =
  | "OWNER"
  | "ADMIN"
  | "USER"
  | "PRINCIPAL"
  | "SUPERVISOR"
  | "MANAGER"
  | "TREASURER"
  | "BENEFICIARY"; // Allow for custom roles

export type PermissionRole = {
  permission: Role;
};

export type Resource = keyof Permissions;

export type User = { blockedBy: string[]; id: string };

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

export type Permissions = {
  bfs: {
    dataType: {
      groupId: string;
      bfId: string;
    };
    action: "view" | "create" | "update";
  };
  admin: {
    dataType: any; // No specific data required
    action: "view" | "create" | "update";
  };
  wallet: {
    dataType: any; // No specific data required
    action: "view" | "create" | "update";
  };
  principal: {
    dataType: any; // No specific data required
    action: "view" | "create" | "update";
  };
  supervisor: {
    dataType: any; // No specific data required
    action: "view" | "create" | "update";
  };
  manager: {
    dataType: any; // No specific data required
    action: "view" | "create" | "update";
  };
  treasurer: {
    dataType: any; // No specific data required
    action: "view" | "create" | "update";
  };
  beneficiary: {
    dataType: any; // No specific data required
    action: "view" | "create" | "update";
  };
  myPayments: {
    dataType: {
      groupId: string;
      bfId: string;
    };
    action: "view" | "create" | "update";
  };
  fundRules: {
    dataType: {
      groupId: string;
      bfId: string;
    };
    action: "view" | "create" | "update";
  };
  principals: {
    dataType: {
      groupId: string;
      bfId: string;
    };
    action: "view" | "create" | "update";
  };
  roles: {
    dataType: {
      groupId: string;
      bfId: string;
    };
    action: "view" | "create" | "update";
  };
  paymentMethods: {
    dataType: {
      groupId: string;
      bfId: string;
    };
    action: "view" | "create" | "update";
  };
  paymentSettings: {
    dataType: {
      groupId: string;
      bfId: string;
    };
    action: "view" | "create" | "update";
  };
  joinRequests: {
    dataType: {
      groupId: string;
      bfId: string;
    };
    action: "view" | "create" | "update";
  };
};

const ROLES = {
  ADMIN: {
    bfs: {
      view: true,
      create: true,
      update: true,
    },
    admin: {
      view: true,
      create: true,
      update: true,
    },
    wallet: {
      view: true,
      create: true,
      update: true,
    },
    principal: {
      view: true,
      create: true,
      update: true,
    },
    myPayments: {
      view: true,
      create: true,
      update: true,
    },
    fundRules: {
      view: true,
      create: true,
      update: true,
    },
    principals: {
      view: true,
      create: true,
      update: true,
    },
    supervisor: {
      view: false,
      create: false,
      update: false,
    },
    manager: {
      view: false,
      create: false,
      update: false,
    },
    treasurer: {
      view: false,
      create: false,
      update: false,
    },
    roles: {
      view: true,
      create: true,
      update: true,
    },
    paymentMethods: {
      view: true,
      create: true,
      update: true,
    },
    paymentSettings: {
      view: true,
      create: true,
      update: true,
    },
    joinRequests: {
      view: true,
      create: true,
      update: true,
    },
    beneficiary: {
      view: false,
      create: false,
      update: false,
    },
  },
  OWNER: {
    bfs: {
      view: true,
      create: true,
      update: true,
    },
    admin: {
      view: true,
      create: true,
      update: true,
    },
    wallet: {
      view: true,
      create: true,
      update: true,
    },
    principal: {
      view: true,
      create: true,
      update: true,
    },
    myPayments: {
      view: true,
      create: true,
      update: true,
    },
    fundRules: {
      view: true,
      create: true,
      update: true,
    },
    principals: {
      view: true,
      create: true,
      update: true,
    },
    roles: {
      view: true,
      create: true,
      update: true,
    },
    paymentMethods: {
      view: true,
      create: true,
      update: true,
    },
    paymentSettings: {
      view: true,
      create: true,
      update: true,
    },
    joinRequests: {
      view: true,
      create: true,
      update: true,
    },
    supervisor: {
      view: false,
      create: false,
      update: false,
    },
    manager: {
      view: false,
      create: false,
      update: false,
    },
    treasurer: {
      view: false,
      create: false,
      update: false,
    },
    beneficiary: {
      view: false,
      create: false,
      update: false,
    },
  },
  USER: {
    bfs: {
      view: false,
      create: false,
      update: false,
    },
    admin: {
      view: true,
      create: false,
      update: false,
    },
    wallet: {
      view: true,
      create: false,
      update: false,
    },
    principal: {
      view: true,
      create: false,
      update: false,
    },
    myPayments: {
      view: false,
      create: false,
      update: false,
    },
    fundRules: {
      view: false,
      create: false,
      update: false,
    },
    principals: {
      view: false,
      create: false,
      update: false,
    },
    roles: {
      view: false,
      create: false,
      update: false,
    },
    paymentMethods: {
      view: false,
      create: false,
      update: false,
    },
    paymentSettings: {
      view: false,
      create: false,
      update: false,
    },
    joinRequests: {
      view: false,
      create: false,
      update: false,
    },
    supervisor: {
      view: false,
      create: false,
      update: false,
    },
    manager: {
      view: false,
      create: false,
      update: false,
    },
    treasurer: {
      view: false,
      create: false,
      update: false,
    },
    beneficiary: {
      view: false,
      create: false,
      update: false,
    },
  },
  PRINCIPAL: {
    bfs: {
      view: true,
      create: false,
      update: true,
    },
    admin: {
      view: false,
      create: false,
      update: false,
    },
    wallet: {
      view: true,
      create: false,
      update: false,
    },
    principal: {
      view: true,
      create: false,
      update: false,
    },
    myPayments: {
      view: true,
      create: false,
      update: false,
    },
    fundRules: {
      view: false,
      create: false,
      update: false,
    },
    principals: {
      view: false,
      create: false,
      update: false,
    },
    roles: {
      view: false,
      create: false,
      update: false,
    },
    paymentMethods: {
      view: true,
      create: false,
      update: false,
    },
    paymentSettings: {
      view: true,
      create: false,
      update: false,
    },
    joinRequests: {
      view: false,
      create: false,
      update: false,
    },
    supervisor: {
      view: false,
      create: false,
      update: false,
    },
    manager: {
      view: false,
      create: false,
      update: false,
    },
    treasurer: {
      view: false,
      create: false,
      update: false,
    },
    beneficiary: {
      view: false,
      create: false,
      update: false,
    },
  },
  SUPERVISOR: {
    bfs: {
      view: false,
      create: false,
      update: false,
    },
    admin: {
      view: false,
      create: false,
      update: false,
    },
    wallet: {
      view: false,
      create: false,
      update: false,
    },
    principal: {
      view: false,
      create: false,
      update: false,
    },
    myPayments: {
      view: false,
      create: false,
      update: false,
    },
    fundRules: {
      view: false,
      create: false,
      update: false,
    },
    principals: {
      view: false,
      create: false,
      update: false,
    },
    roles: {
      view: false,
      create: false,
      update: false,
    },
    paymentMethods: {
      view: false,
      create: false,
      update: false,
    },
    paymentSettings: {
      view: false,
      create: false,
      update: false,
    },
    joinRequests: {
      view: false,
      create: false,
      update: false,
    },
    supervisor: {
      view: true,
      create: true,
      update: true,
    },
    manager: {
      view: false,
      create: false,
      update: false,
    },
    treasurer: {
      view: false,
      create: false,
      update: false,
    },
    beneficiary: {
      view: false,
      create: false,
      update: false,
    },
  },

  MANAGER: {
    bfs: {
      view: false,
      create: false,
      update: false,
    },
    admin: {
      view: false,
      create: false,
      update: false,
    },
    wallet: {
      view: false,
      create: false,
      update: false,
    },
    principal: {
      view: false,
      create: false,
      update: false,
    },
    myPayments: {
      view: false,
      create: false,
      update: false,
    },
    fundRules: {
      view: false,
      create: false,
      update: false,
    },
    principals: {
      view: false,
      create: false,
      update: false,
    },
    roles: {
      view: false,
      create: false,
      update: false,
    },
    paymentMethods: {
      view: false,
      create: false,
      update: false,
    },
    paymentSettings: {
      view: false,
      create: false,
      update: false,
    },
    joinRequests: {
      view: false,
      create: false,
      update: false,
    },
    supervisor: {
      view: false,
      create: false,
      update: false,
    },
    manager: {
      view: true,
      create: true,
      update: true,
    },
    treasurer: {
      view: false,
      create: false,
      update: false,
    },
    beneficiary: {
      view: false,
      create: false,
      update: false,
    },

  },

  TREASURER: {
    bfs: {
      view: false,
      create: false,
      update: false,
    },
    admin: {
      view: false,
      create: false,
      update: false,
    },
    wallet: {
      view: false,
      create: false,
      update: false,
    },
    principal: {
      view: false,
      create: false,
      update: false,
    },
    myPayments: {
      view: false,
      create: true,
      update: true,
    },
    fundRules: {
      view: false,
      create: false,
      update: false,
    },
    principals: {
      view: false,
      create: false,
      update: false,
    },
    roles: {
      view: false,
      create: false,
      update: false,
    },
    paymentMethods: {
      view: false,
      create: false,
      update: false,
    },
    paymentSettings: {
      view: false,
      create: false,
      update: false,
    },
    joinRequests: {
      view: false,
      create: false,
      update: false,
    },
    supervisor: {
      view: false,
      create: false,
      update: false,
    },
    manager: {
      view: false,
      create: false,
      update: false,
    },
    treasurer: {
      view: true,
      create: true,
      update: true,
    },
    beneficiary: {
      view: false,
      create: false,
      update: false,
    },
  },
  BENEFICIARY: {
    bfs: {
      view: false,
      create: false,
      update: false,
    },
    admin: {
      view: false,
      create: false,
      update: false,
    },
    wallet: {
      view: true,
      create: true,
      update: true,
    },
    principal: {
      view: false,
      create: false,
      update: false,
    },
    myPayments: {
      view: false,
      create: false,
      update: false,
    },
    fundRules: {
      view: false,
      create: false,
      update: false,
    },
    principals: {
      view: false,
      create: false,
      update: false,
    },
    roles: {
      view: false,
      create: false,
      update: false,
    },
    paymentMethods: {
      view: false,
      create: false,
      update: false,
    },
    paymentSettings: {
      view: false,
      create: false,
      update: false,
    },
    joinRequests: {
      view: false,
      create: false,
      update: false,
    },
    supervisor: {
      view: false,
      create: false,
      update: false,
    },
    manager: {
      view: false,
      create: false,
      update: false,
    },
    treasurer: {
      view: false,
      create: false,
      update: false,
    },
    beneficiary: {
      view: true,
      create: true,
      update: true,
    },
  },

} as const satisfies RolesWithPermissions;


export function hasBfPermission<Resource extends keyof Permissions>(
  user: User,
  permissionRole: PermissionRole[] | string[],
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {
  const roles = permissionRole.map((role) =>
    typeof role === 'string' ? role : role.permission
  );

  return roles.some((role) => {
    // Check if the role exists in ROLES
    if (!(role in ROLES)) return false;

    // Check if the resource exists for this role
    const resourcePermissions = ROLES[role as keyof typeof ROLES][resource];
    if (!resourcePermissions) return false;

    // Check if the action exists for this resource
    const permission = resourcePermissions[action];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return (
      data != null &&
      (
        permission as (
          user: User,
          data: Permissions[Resource]["dataType"]
        ) => boolean
      )(user, data)
    );
  });
}
