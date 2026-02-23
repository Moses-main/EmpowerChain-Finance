import { Shield, Zap, Users, BookOpen, TrendingUp, Lock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Collateral-Free',
    description: 'Access loans without traditional collateral. Blockchain reputation replaces outdated barriers.',
  },
  {
    icon: Zap,
    title: 'Low Gas Fees',
    description: 'Polygon-powered settlements keep transaction costs minimal and transfers fast.',
  },
  {
    icon: Users,
    title: 'P2P Marketplace',
    description: 'Direct connections between borrowers and lenders. No intermediaries, better rates.',
  },
  {
    icon: BookOpen,
    title: 'Learn & Earn',
    description: 'Complete education modules to earn NFT badges and unlock better loan terms.',
  },
  {
    icon: TrendingUp,
    title: 'Yield Generation',
    description: 'Lenders earn competitive returns while funding real entrepreneurs.',
  },
  {
    icon: Lock,
    title: 'On-Chain Security',
    description: 'Smart contracts ensure transparent, verifiable, and tamper-proof transactions.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="section" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
      <div className="container-wide">
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[hsl(var(--foreground))] tracking-tight mb-4">
            Everything you need to participate
          </h2>
          <p className="text-lg" style={{ color: 'hsl(var(--muted))', lineHeight: '1.6' }}>
            A developer-minded platform focused on transparency, fairness, and real-world impact.
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
