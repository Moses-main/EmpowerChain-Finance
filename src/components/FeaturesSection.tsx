import { Shield, Zap, Users, BookOpen, TrendingUp, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: t('home.features.collateral_free.title'),
      description: t('home.features.collateral_free.desc'),
    },
    {
      icon: Zap,
      title: t('home.features.low_gas.title'),
      description: t('home.features.low_gas.desc'),
    },
    {
      icon: Users,
      title: t('home.features.p2p.title'),
      description: t('home.features.p2p.desc'),
    },
    {
      icon: BookOpen,
      title: t('home.features.learn_earn.title'),
      description: t('home.features.learn_earn.desc'),
    },
    {
      icon: TrendingUp,
      title: t('home.features.yield.title'),
      description: t('home.features.yield.desc'),
    },
    {
      icon: Lock,
      title: t('home.features.security.title'),
      description: t('home.features.security.desc'),
    },
  ];

  return (
    <section className="section" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
      <div className="container-wide">
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[hsl(var(--foreground))] tracking-tight mb-4">
            {t('home.features.title')}
          </h2>
          <p className="text-lg" style={{ color: 'hsl(var(--muted))', lineHeight: '1.6' }}>
            {t('home.features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-xl p-6 md:p-8 border transition-all duration-200"
                style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#e0e7ff' }}>
                  <Icon className="w-6 h-6" style={{ color: 'hsl(var(--primary))' }} />
                </div>
                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
                  {feature.title}
                </h3>
                <p className="leading-relaxed" style={{ color: 'hsl(var(--muted))' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
