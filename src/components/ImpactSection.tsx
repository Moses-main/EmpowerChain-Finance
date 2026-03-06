import { Target, TrendingUp, Award, Users } from 'lucide-react';
import { useStats } from '../hooks/useLoans';
import { useTranslation } from 'react-i18next';

const ImpactSection = () => {
  const { t } = useTranslation()
  const { data: stats } = useStats()

  const impacts = [
    {
      icon: Users,
      metric: stats?.active_loans_count ? stats.active_loans_count : '...',
      label: t('home.impact.active_loans.label'),
      description: t('home.impact.active_loans.desc'),
    },
    {
      icon: TrendingUp,
      metric: stats?.total_borrowed ? `$${Number(stats.total_borrowed).toLocaleString()}` : '$...',
      label: t('home.impact.total_borrowed.label'),
      description: t('home.impact.total_borrowed.desc'),
    },
    {
      icon: Target,
      metric: '1M+',
      label: t('home.impact.target_users.label'),
      description: t('home.impact.target_users.desc'),
    },
    {
      icon: Award,
      metric: 'SDG 8 & 10',
      label: t('home.impact.goals.label'),
      description: t('home.impact.goals.desc'),
    },
  ];

  return (
    <section className="section bg-white">
      <div className="container-wide">
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[hsl(var(--foreground))] tracking-tight mb-4">
            {t('home.impact.title')}
          </h2>
          <p className="text-lg" style={{ color: 'hsl(var(--muted))', lineHeight: '1.6' }}>
            {t('home.impact.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impacts.map((impact, index) => {
            const Icon = impact.icon;
            return (
              <div
                key={index}
                className="rounded-xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg border flex items-center justify-center transition-colors" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                    <Icon className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'hsl(var(--muted))' }}>{impact.label}</span>
                </div>
                <div className="text-3xl font-semibold text-[hsl(var(--foreground))] mb-1">
                  {impact.metric}
                </div>
                <p className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                  {impact.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl p-10 md:p-12 text-center" style={{ backgroundColor: '#0a0a0a', boxShadow: 'var(--shadow-lg)' }}>
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            {t('home.impact.mission.title')}
          </h3>
          <p className="text-lg" style={{ color: '#737373', maxWidth: '672px', margin: '0 auto', lineHeight: '1.7' }}>
            {t('home.impact.mission.desc')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
