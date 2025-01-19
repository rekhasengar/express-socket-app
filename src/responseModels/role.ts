export = {
  GetRolesResponse: {
    200: {
      body: {
        type: 'Array',
        roles: [
          {
            id: '182efc77-9a53-4dc8-bee8-93887fb65103',
            name: 'Admin',
            description: 'This is the admin role.',
            createdAt: '2025-01-19 14:49:21.547212',
            updatedAt: '2025-01-19 14:49:21.547212',
          },
          {
            id: '4037afe0-ecc0-4f0c-8a32-414e1aa3dff2',
            name: 'User',
            description: 'This is the user role.',
            createdAt: '2025-01-19 14:49:21.547212',
            updatedAt: '2025-01-19 14:49:21.547212',
          },
        ],
      },
    },
    404: {
      body: {
        type: 'Array',
        roles: [],
      },
    },
  },
};
