import { Globe, Target, TrendingUp, Award } from 'lucide-react';

const impacts = [
  {
    icon: Target,
    metric: '1M+',
    label: 'Target Users',
    description: 'Underserved entrepreneurs by 2027',
  },
  {
    icon: TrendingUp,
    metric: '$500M',
    label: 'Projected Volume',
    description: 'Loan volume through the platform',
  },
  {
    icon: Globe,
    metric: '50+',
    label: 'Countries',
    description: 'Africa, Asia, and Latin America',
  },
  {
    icon: Award,
    metric: 'SDG 8 & 10',
    label: 'Impact Goals',
    description: 'Decent work & reduced inequalities',
  },
];

const ImpactSection = () => {
  return (
    <section className="section bg-white">
      <div className="container-wide">
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[hsl(var(--foreground))] tracking-tight mb-4">
            Building the future of inclusive finance
          </h2>
          <p className="text-lg" style={{ color: 'hsl(var(--muted))', lineHeight: '1.6' }}>
            Every metric is aligned with measurable outcomes and global development goals.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impacts.map((impact, index) => {
            const Icon = impact.icon;
            return (
              <div
                key={index}
                className="rounded-xl p-6 border"
                style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg border flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                    <Icon className="w-5 h-5" style={{ color: 'hsl(var(--muted))' }} />
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
            Our mission
          </h3>
          <p className="text-lg" style={{ color: '#737373', maxWidth: '672px', margin: '0 auto', lineHeight: '1.7' }}>
            By 2030, EmpowerChain will enable 1 million entrepreneurs in underserved communities 
            to access fair, transparent, and inclusive microfinance — regardless of geography or background.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
