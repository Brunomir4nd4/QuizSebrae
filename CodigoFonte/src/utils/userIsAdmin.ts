const allowedRoles = ['facilitator', 'supervisor'];
export const userIsAdmin = (role: string[]) => allowedRoles.some(r => role.includes(r));