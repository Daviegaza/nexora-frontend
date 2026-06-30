import type { User } from '../types';
import type { Capability } from '../constants/permissions';
import { ROLE_CAPS } from '../constants/permissions';

/**
 * Resolve the effective capability set for a user:
 *   defaults(role)  +  user.permissionsAdd  -  user.permissionsRemove
 *
 * `permissionsAdd` lets an owner/director grant additional caps to a user
 * without changing their role (e.g. a Branch Manager who can also `users.invite`).
 * `permissionsRemove` lets them restrict a role default (e.g. a Cashier who
 * can sell but NOT void).
 */
export function resolveCaps(user: User | null | undefined): Set<Capability> {
  if (!user) return new Set();
  const base = ROLE_CAPS[user.role] ?? [];
  const set = new Set<Capability>(base);
  user.permissionsAdd?.forEach((c) => set.add(c as Capability));
  user.permissionsRemove?.forEach((c) => set.delete(c as Capability));
  return set;
}

export function userCan(user: User | null | undefined, cap: Capability): boolean {
  return resolveCaps(user).has(cap);
}

export function userCanRoute(user: User | null | undefined, path: string): boolean {
  return resolveCaps(user).has(`nav:${path}` as Capability);
}

/**
 * Used by Settings → Users → Permissions panel. Returns the diff between a
 * user's effective set and their role's defaults — surfaces the explicit
 * overrides for display.
 */
export function capDiff(user: User) {
  const defaults = new Set<Capability>(ROLE_CAPS[user.role] ?? []);
  const effective = resolveCaps(user);
  const added: Capability[] = [];
  const removed: Capability[] = [];
  effective.forEach((c) => {
    if (!defaults.has(c)) added.push(c);
  });
  defaults.forEach((c) => {
    if (!effective.has(c)) removed.push(c);
  });
  return { added, removed };
}
