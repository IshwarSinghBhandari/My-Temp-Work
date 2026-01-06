import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { UserRolePermissions } from "@/types/authslice";
import { Route, pathToResource } from "@/utils/routes";

type Permission = NonNullable<UserRolePermissions["permissions"]>[number];

function usePermissions(): Permission[] {
  const permissions = useAppSelector(
    (state) => state.auth.userRole?.permissions
  );
  return useMemo(() => permissions || [], [permissions]);
}

// Checks if user has a specific permission (resource + action)
export function useHasPermission(resource: string, action: string): boolean {
  const permissions = usePermissions();
  if (!permissions?.length) return false;

  return permissions.some(
    (p: Permission) => p.resource === resource && p.action === action
  );
}

// Maps current pathname to resource name (e.g., "/master/user-management" -> "userManagement")
function useCurrentResource(): string | null {
  const pathname = usePathname();

  return useMemo(() => {
    if (pathToResource[pathname]) {
      return pathToResource[pathname];
    }

    // Match longest paths first to handle sub-routes correctly
    const sortedPaths = Object.entries(pathToResource).sort(
      (a, b) => b[0].length - a[0].length
    );

    for (const [path, resource] of sortedPaths) {
      if (pathname === path || pathname.startsWith(path + "/")) {
        return resource;
      }
    }

    return null;
  }, [pathname]);
}

// Checks write permission for current route (auto-detects resource from pathname)
export function useCanWrite(resource?: string): boolean {
  const pathnameResource = useCurrentResource();
  const resourceToCheck = resource || pathnameResource;

  if (!resourceToCheck) return false;

  const permissions = usePermissions();
  if (!permissions.length) return false;

  return permissions.some(
    (p: Permission) => p.resource === resourceToCheck && p.action === "write"
  );
}

// Checks update permission for current route
export function useCanUpdate(resource?: string): boolean {
  const pathnameResource = useCurrentResource();
  const resourceToCheck = resource || pathnameResource;

  if (!resourceToCheck) return false;

  const permissions = usePermissions();
  if (!permissions.length) return false;

  return permissions.some(
    (p: Permission) => p.resource === resourceToCheck && p.action === "update"
  );
}

// Returns all route paths user has permission to access
export function usePermittedRoutes(): string[] {
  const permissions = usePermissions();
  return useMemo(() => {
    if (!permissions.length) return [];

    const routes = permissions
      .map((p) => {
        const key = p.resource as keyof typeof Route;
        return Route[key];
      })
      .filter((path): path is string => Boolean(path));

    return Array.from(new Set(routes));
  }, [permissions]);
}

// Returns the first permitted route (used for redirects after login)
export function useFirstPermittedRoute(): string | null {
  const permittedRoutes = usePermittedRoutes();
  return permittedRoutes.length ? permittedRoutes[0] : null;
}

export default useHasPermission;
