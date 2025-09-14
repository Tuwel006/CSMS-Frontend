import React from 'react'

type Roles = 'admin' | 'user' | 'superadmin' | 'guest' | 'subscriber';

interface RoleGuardProps {
    allowedRoles: Roles[];
    children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }: RoleGuardProps) => {
    const { isAuth, role } = useAuthToken();
  return (
    <div>RoleGuard</div>
  )
}

export default RoleGuard