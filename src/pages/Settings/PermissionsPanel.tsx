import { useMemo, useState } from 'react';
import { Shield, Check, X as XIcon, Search } from 'lucide-react';
import { Card, Button, Badge, Input, SectionHeader } from '../../components/ui';
import { CAPABILITIES, ROLE_CAPS } from '../../constants/permissions';
import { ROLE_LABEL } from '../../constants';
import type { Role, User } from '../../types';
import { resolveCaps } from '../../utils/permissions';

/**
 * Settings → Permissions: owners can grant/revoke individual capabilities
 * per user on top of role defaults. Backend: PATCH /api/users/:id/grant
 */
export function PermissionsPanel({
  users,
  currentUserRole,
  onGrant,
}: {
  users: User[];
  currentUserRole: Role;
  onGrant: (userId: string, add: string[], remove: string[]) => Promise<void> | void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(users[0]?.id ?? null);
  const [q, setQ] = useState('');
  const user = users.find((u) => u.id === selectedId);
  const canGrant =
    currentUserRole === 'owner' ||
    currentUserRole === 'director' ||
    currentUserRole === 'super_admin' ||
    currentUserRole === 'admin';

  const effective = useMemo(() => (user ? resolveCaps(user) : new Set<string>()), [user]);
  const defaults = useMemo(() => new Set(user ? ROLE_CAPS[user.role] : []), [user]);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return CAPABILITIES.filter((c) => !s || c.toLowerCase().includes(s));
  }, [q]);

  async function toggle(cap: string) {
    if (!user || !canGrant) return;
    const isDefault = defaults.has(cap as never);
    const adds = new Set(user.permissionsAdd ?? []);
    const removes = new Set(user.permissionsRemove ?? []);
    if (effective.has(cap as never)) {
      // Revoke
      if (isDefault) removes.add(cap);
      else adds.delete(cap);
    } else {
      // Grant
      if (isDefault) removes.delete(cap);
      else adds.add(cap);
    }
    await onGrant(user.id, Array.from(adds), Array.from(removes));
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
        <SectionHeader
          title="User Permissions"
          subtitle={
            canGrant
              ? "Grant or revoke individual capabilities. Defaults come from the user's role."
              : 'Read-only view (you need users.grant capability to edit).'
          }
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] divide-y md:divide-y-0 md:divide-x divide-surface-100 dark:divide-surface-800">
        {/* User list */}
        <div className="max-h-[560px] overflow-y-auto">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedId(u.id)}
              className={`w-full text-left p-3 flex items-center gap-3 border-b border-surface-50 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800 ${selectedId === u.id ? 'bg-nexora-50 dark:bg-nexora-500/10' : ''}`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nexora-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {u.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-surface-800 dark:text-surface-200 truncate">
                  {u.name}
                </div>
                <div className="text-[10px] text-surface-400 truncate">{ROLE_LABEL[u.role]}</div>
              </div>
              {(u.permissionsAdd?.length ?? 0) + (u.permissionsRemove?.length ?? 0) > 0 && (
                <Badge size="sm" variant="violet">
                  override
                </Badge>
              )}
            </button>
          ))}
        </div>
        {/* Cap matrix */}
        <div>
          {!user ? (
            <div className="p-8 text-center text-sm text-surface-400">
              Select a user to view permissions.
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-surface-100 dark:border-surface-800 flex items-center gap-3">
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search capabilities..."
                  icon={<Search size={12} />}
                  className="flex-1"
                />
                <Badge variant="info" dot>
                  {effective.size} active
                </Badge>
              </div>
              <div className="max-h-[480px] overflow-y-auto p-3 space-y-1">
                {filtered.map((cap) => {
                  const has = effective.has(cap);
                  const isDefault = defaults.has(cap);
                  return (
                    <button
                      key={cap}
                      disabled={!canGrant}
                      onClick={() => toggle(cap)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-left transition-colors ${canGrant ? 'hover:bg-surface-50 dark:hover:bg-surface-800' : 'cursor-default'}`}
                    >
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${has ? 'bg-emerald-500 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-400'}`}
                      >
                        {has ? <Check size={12} /> : <XIcon size={12} />}
                      </span>
                      <code className="flex-1 font-mono text-[11px] text-surface-700 dark:text-surface-300">
                        {cap}
                      </code>
                      {isDefault ? (
                        <Badge size="sm" variant="default">
                          role default
                        </Badge>
                      ) : has ? (
                        <Badge size="sm" variant="success">
                          granted
                        </Badge>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      {!canGrant && (
        <div className="px-5 py-3 border-t border-surface-100 dark:border-surface-800 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10">
          <Shield size={14} /> Ask an owner to grant you{' '}
          <code className="font-mono">users.grant</code> to manage permissions.
        </div>
      )}
    </Card>
  );
}
