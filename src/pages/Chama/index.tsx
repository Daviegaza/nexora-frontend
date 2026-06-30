import { useState } from 'react';
import { Users, Plus, TrendingUp, Calendar, HandCoins, Repeat } from 'lucide-react';
import { Card, Button, Badge, SectionHeader, EmptyState, ProgressBar } from '../../components/ui';
import { formatCurrency } from '../../utils';

interface DemoGroup {
  id: string;
  name: string;
  members: number;
  monthlyContribution: number;
  collected: number;
  nextRota: string;
  status: 'active';
}

const demo: DemoGroup[] = [
  {
    id: 'g1',
    name: 'Mama Mboga Kibera',
    members: 12,
    monthlyContribution: 2000,
    collected: 22000,
    nextRota: 'Mary Wanjiku · Aug 5',
    status: 'active',
  },
  {
    id: 'g2',
    name: 'Boda Boda Westlands',
    members: 18,
    monthlyContribution: 5000,
    collected: 86000,
    nextRota: 'John Otieno · Aug 1',
    status: 'active',
  },
  {
    id: 'g3',
    name: 'Wakulima Limuru',
    members: 25,
    monthlyContribution: 3000,
    collected: 71000,
    nextRota: 'Peter Kamau · Aug 12',
    status: 'active',
  },
];

export default function Chama() {
  const [groups] = useState<DemoGroup[]>(demo);

  return (
    <div className="p-6 space-y-5">
      <SectionHeader
        title="Chama / Vyama"
        subtitle="Group savings, merry-go-round rota, and group loans"
        action={
          <Button variant="primary" size="sm" icon={<Plus size={14} />}>
            New Chama
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Active Groups',
            value: groups.length,
            icon: <Users size={16} />,
            color: 'text-nexora-600 bg-nexora-50 dark:bg-nexora-500/10',
          },
          {
            label: 'Total Members',
            value: groups.reduce((s, g) => s + g.members, 0),
            icon: <Users size={16} />,
            color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10',
          },
          {
            label: 'Pool This Month',
            value: formatCurrency(groups.reduce((s, g) => s + g.collected, 0)),
            icon: <TrendingUp size={16} />,
            color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
          },
        ].map((k) => (
          <Card key={k.label} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.color}`}>
              {k.icon}
            </div>
            <div>
              <div className="text-xs text-surface-400">{k.label}</div>
              <div className="text-lg font-bold text-surface-900 dark:text-surface-50">
                {k.value}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon={<Users size={20} />}
          title="No chama groups yet"
          description="Start a savings group with friends, family, or co-workers."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {groups.map((g) => {
            const goal = g.monthlyContribution * g.members;
            const pct = Math.min(100, Math.round((g.collected / goal) * 100));
            return (
              <Card key={g.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                      {g.name}
                    </h3>
                    <p className="text-xs text-surface-400 mt-0.5">
                      {g.members} members · KSh {g.monthlyContribution.toLocaleString()}/mo
                    </p>
                  </div>
                  <Badge variant="success" dot>
                    Active
                  </Badge>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] text-surface-500 mb-1">
                    <span>Collected this month</span>
                    <span className="font-semibold">
                      {formatCurrency(g.collected)} / {formatCurrency(goal)}
                    </span>
                  </div>
                  <ProgressBar
                    value={g.collected}
                    max={goal}
                    color={pct >= 100 ? 'emerald' : 'nexora'}
                    size="md"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-surface-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} /> {g.nextRota}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HandCoins size={11} /> {g.members * 2} loans
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Repeat size={11} /> Rota: monthly
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-surface-100 dark:border-surface-800">
                  <Button size="xs" variant="outline" className="flex-1">
                    Members
                  </Button>
                  <Button size="xs" variant="outline" className="flex-1">
                    Contributions
                  </Button>
                  <Button size="xs" variant="primary" className="flex-1">
                    Open
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
