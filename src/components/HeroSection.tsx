import { ArrowRight, TrendingUp, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="section bg-white">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
              <Globe className="w-3.5 h-3.5" style={{ color: 'hsl(var(--primary))' }} />
              <span className="text-sm" style={{ color: 'hsl(var(--muted))' }}>{t('home.hero.badge')}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[hsl(var(--foreground))] leading-tight tracking-tight mb-6">
              {t('home.hero.title_part1')}{' '}
              <span style={{ color: 'hsl(var(--primary))' }}>{t('home.hero.title_highlight')}</span>{' '}
              {t('home.hero.title_part2')}
            </h1>

            <p className="text-lg md:text-xl" style={{ color: 'hsl(var(--muted))', maxWidth: '560px', lineHeight: '1.6', marginBottom: '2rem' }}>
              {t('home.hero.desc')}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                to="/borrow"
                className="px-5 py-3 text-sm font-medium rounded-lg text-white transition-all duration-200"
                style={{ backgroundColor: 'hsl(var(--primary))' }}
              >
                <span className="flex items-center gap-2">
                  {t('home.hero.get_started')}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link
                to="/lend"
                className="px-5 py-3 text-sm font-medium rounded-lg border transition-all duration-200"
                style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
              >
                {t('home.hero.view_opportunities')}
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: '#e0e7ff' }}>
                    <span className="text-xs font-medium" style={{ color: '#4f46e5' }}>AB</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: '#d1fae5' }}>
                    <span className="text-xs font-medium" style={{ color: '#059669' }}>CD</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
                    <span className="text-xs font-medium" style={{ color: '#d97706' }}>EF</span>
                  </div>
                </div>
                <span className="text-sm" style={{ color: 'hsl(var(--muted))' }}>{t('home.hero.stats_users')}</span>
              </div>
              <div className="hidden sm:block h-8 w-px" style={{ backgroundColor: 'hsl(var(--border))' }} />
              <div className="flex items-center gap-2 text-sm" style={{ color: 'hsl(var(--muted))' }}>
                <TrendingUp className="w-4 h-4" style={{ color: '#10b981' }} />
                <span>{t('home.hero.stats_disbursed')}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl p-6 md:p-8 border" style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))', boxShadow: 'var(--shadow-md)' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm" style={{ color: 'hsl(var(--muted))' }}>{t('home.hero.growth_title')}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl md:text-4xl font-semibold text-[hsl(var(--foreground))]">+87%</span>
                    <span className="text-sm font-medium" style={{ color: '#10b981' }}>{t('home.hero.growth_revenue')}</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e0e7ff' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: '#4f46e5' }} />
                </div>
              </div>
              
              <div className="h-20 md:h-24 flex items-end gap-1.5 md:gap-2 mb-4">
                {[40, 55, 45, 70, 60, 80, 75, 90].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80 min-h-[8px]"
                    style={{ 
                      height: `${height}%`, 
                      minWidth: '8px',
                      backgroundColor: i === 7 ? 'hsl(var(--primary))' : '#c7d2fe' 
                    }}
                  />
                ))}
              </div>

              <div className="pt-5 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#d1fae5' }}>
                    <Shield className="w-4 h-4" style={{ color: '#059669' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">{t('home.hero.smart_contract_title')}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(var(--muted))' }}>{t('home.hero.smart_contract_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
