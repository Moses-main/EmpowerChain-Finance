import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LiteracyModule from '../components/LiteracyModeule';
import { ArrowLeft, Trophy, BookOpen, Star } from 'lucide-react';

const STORAGE_KEY = 'empowerchain_completed_modules'

export default function Learn() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [moduleScores, setModuleScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCompletedModules(parsed.completed || [])
        setModuleScores(parsed.scores || {})
      } catch (e) {
        console.error('Failed to load progress', e)
      }
    }
  }, [])

  const handleModuleComplete = (moduleId: string, score: number, passed: boolean) => {
    if (passed && !completedModules.includes(moduleId)) {
      const updated = [...completedModules, moduleId]
      setCompletedModules(updated)
      setModuleScores(prev => ({ ...prev, [moduleId]: score }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        completed: updated,
        scores: { ...moduleScores, [moduleId]: score }
      }))
    }
  }

  const modules = [
    {
      id: 'budgeting-101',
      title: 'Budgeting 101',
      description: 'Learn how to create and manage a business budget effectively.',
      difficulty: 'Beginner',
      duration: '15 min',
      nftBadge: '💰',
      tier: 'Bronze',
      questions: [
        {
          id: 1,
          question: 'What is the first step in creating a business budget?',
          options: ['Estimate your revenue', 'List all your expenses', 'Set financial goals', 'Open a bank account'],
          correctAnswer: 2,
        },
        {
          id: 2,
          question: 'Which of these is a fixed cost?',
          options: ['Raw materials', 'Rent for office space', 'Shipping costs', 'Marketing expenses'],
          correctAnswer: 1,
        },
        {
          id: 3,
          question: 'What percentage of revenue should you typically save for emergencies?',
          options: ['5%', '10%', '20%', '50%'],
          correctAnswer: 2,
        },
      ],
    },
    {
      id: 'loan-management',
      title: 'Loan Management Essentials',
      description: 'Master the fundamentals of managing loans and repayment strategies.',
      difficulty: 'Intermediate',
      duration: '20 min',
      nftBadge: '📊',
      tier: 'Silver',
      questions: [
        {
          id: 1,
          question: 'What does APR stand for?',
          options: ['Annual Percentage Rate', 'Annual Payment Requirement', 'Asset Protection Rate', 'Approved Payment Record'],
          correctAnswer: 0,
        },
        {
          id: 2,
          question: 'Which repayment strategy pays off debt fastest?',
          options: ['Minimum payments only', 'Paying extra on highest interest debt', 'Equal payments to all debts', 'Paying only principal'],
          correctAnswer: 1,
        },
        {
          id: 3,
          question: 'What is a grace period in a loan?',
          options: ['A discount on interest', 'Time before you must start repaying', 'Extra time to pay without penalty', 'A reduction in loan amount'],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: 'financial-planning',
      title: 'Financial Planning for Growth',
      description: 'Develop long-term financial strategies to scale your business.',
      difficulty: 'Advanced',
      duration: '25 min',
      nftBadge: '🚀',
      tier: 'Gold',
      questions: [
        {
          id: 1,
          question: 'What is the purpose of a cash flow forecast?',
          options: ['To predict future profits', 'To track historical spending', 'To anticipate when you\'ll have cash available', 'To calculate tax liability'],
          correctAnswer: 2,
        },
        {
          id: 2,
          question: 'Which metric measures how efficiently a business uses its assets?',
          options: ['Profit margin', 'Asset turnover ratio', 'Debt-to-equity ratio', 'Current ratio'],
          correctAnswer: 1,
        },
        {
          id: 3,
          question: 'What is diversification in business?',
          options: ['Hiring more employees', 'Spreading risk across multiple products/services', 'Increasing marketing spend', 'Opening new locations'],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: 'credit-score',
      title: 'Building Business Credit',
      description: 'Learn how to build and maintain a strong business credit score.',
      difficulty: 'Intermediate',
      duration: '20 min',
      nftBadge: '🏆',
      tier: 'Silver',
      questions: [
        {
          id: 1,
          question: 'What is a business credit score based on?',
          options: ['Personal credit history', 'Business payment history with vendors', 'Number of employees', 'Business location'],
          correctAnswer: 1,
        },
        {
          id: 2,
          question: 'How long does it typically take to build business credit?',
          options: ['1 month', '6 months', '1-2 years', '5+ years'],
          correctAnswer: 2,
        },
        {
          id: 3,
          question: 'Which action can hurt your business credit score?',
          options: ['Paying bills early', 'Missing payments to suppliers', 'Opening a new business line of credit', 'Having multiple revenue sources'],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: 'investment-basics',
      title: 'Investment Basics for Entrepreneurs',
      description: 'Understand how to evaluate investment opportunities for your business.',
      difficulty: 'Advanced',
      duration: '30 min',
      nftBadge: '💎',
      tier: 'Gold',
      questions: [
        {
          id: 1,
          question: 'What is ROI?',
          options: ['Return on Investment', 'Rate of Interest', 'Revenue Operating Index', 'Risk of Insolvency'],
          correctAnswer: 0,
        },
        {
          id: 2,
          question: 'What does diversification mean in investing?',
          options: ['Putting all money in one asset', 'Spreading investments across different assets', 'Only investing in stocks', 'Avoiding all risk'],
          correctAnswer: 1,
        },
        {
          id: 3,
          question: 'What is a venture capital firm?',
          options: ['A bank that lends to small businesses', 'A company that invests in early-stage startups', 'A government agency for business loans', 'An insurance company for businesses'],
          correctAnswer: 1,
        },
      ],
    },
  ];

  const getReward = () => {
    const count = completedModules.length
    if (count >= 5) return { badge: '🏆', title: 'VIP Status', description: 'All modules completed! Full benefits unlocked.' }
    if (count >= 3) return { badge: '🚀', title: 'Gold Tier', description: '3+ modules: 15% lower interest rates' }
    if (count >= 2) return { badge: '📊', title: 'Silver Tier', description: '2+ modules: 10% lower interest rates' }
    if (count >= 1) return { badge: '💰', title: 'Bronze Tier', description: '1+ module: 5% lower interest rates' }
    return { badge: '📚', title: 'Start Learning', description: 'Complete modules to unlock rewards' }
  }

  const currentReward = getReward()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="section">
          <div className="container-narrow">
            <div className="rounded-xl p-6 md:p-8 border text-center" style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}>
              <h1 className="text-2xl md:text-3xl font-semibold text-[hsl(var(--foreground))] mb-2">Financial literacy hub</h1>
              <p className="text-base" style={{ color: 'hsl(var(--muted))' }}>Master practical finance skills and earn NFT badges that unlock better loan rates.</p>
            </div>
          </div>
        </section>

        {selectedModule ? (
          <section className="section">
            <div className="container-narrow">
              <button
                onClick={() => setSelectedModule(null)}
                className="flex items-center gap-2 mb-4 md:mb-6 text-sm font-medium transition-colors"
                style={{ color: 'hsl(var(--primary))' }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to modules
              </button>
              <LiteracyModule 
                moduleId={selectedModule} 
                {...modules.find((m) => m.id === selectedModule)!} 
                onComplete={handleModuleComplete}
              />
            </div>
          </section>
        ) : (
          <>
            <section className="section pt-0">
              <div className="container-wide">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="rounded-xl p-4 border flex items-center gap-3" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                      <BookOpen className="w-5 h-5" style={{ color: '#2563eb' }} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-[hsl(var(--foreground))]">{completedModules.length}/{modules.length}</div>
                      <div className="text-xs" style={{ color: 'hsl(var(--muted))' }}>Modules Completed</div>
                    </div>
                  </div>
                  <div className="rounded-xl p-4 border flex items-center gap-3" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
                      <Trophy className="w-5 h-5" style={{ color: '#d97706' }} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-[hsl(var(--foreground))]">{completedModules.length}</div>
                      <div className="text-xs" style={{ color: 'hsl(var(--muted))' }}>Badges Earned</div>
                    </div>
                  </div>
                  <div className="rounded-xl p-4 border flex items-center gap-3" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#d1fae5' }}>
                      <Star className="w-5 h-5" style={{ color: '#059669' }} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-[hsl(var(--foreground))]">{currentReward.title}</div>
                      <div className="text-xs" style={{ color: 'hsl(var(--muted))' }}>Current Tier</div>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl md:text-2xl font-semibold text-[hsl(var(--foreground))] text-center mb-6 md:mb-8">Available modules</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {modules.map((module) => {
                    const isCompleted = completedModules.includes(module.id);
                    const score = moduleScores[module.id];
                    return (
                      <article key={module.id} className="rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-md" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                        <div className="h-24 md:h-28 flex items-center justify-center relative" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
                          <span className="text-2xl md:text-3xl">{module.nftBadge}</span>
                          {isCompleted && (
                            <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium text-white" style={{ backgroundColor: 'hsl(var(--primary))' }}>
                              Completed {score && `(${score}%)`}
                            </div>
                          )}
                        </div>

                        <div className="p-4 md:p-6">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 rounded" style={{ 
                              backgroundColor: module.difficulty === 'Beginner' ? '#d1fae5' : module.difficulty === 'Intermediate' ? '#fef3c7' : '#fee2e2',
                              color: module.difficulty === 'Beginner' ? '#059669' : module.difficulty === 'Intermediate' ? '#d97706' : '#dc2626'
                            }}>
                              {module.difficulty}
                            </span>
                            <span className="text-xs" style={{ color: 'hsl(var(--muted))' }}>{module.tier} Badge</span>
                          </div>
                          <h3 className="text-base md:text-lg font-medium text-[hsl(var(--foreground))] mb-1">{module.title}</h3>
                          <p className="text-sm mb-3 md:mb-4" style={{ color: 'hsl(var(--muted))' }}>{module.description}</p>

                          <div className="flex items-center justify-between text-xs mb-3 md:mb-4" style={{ color: 'hsl(var(--muted))' }}>
                            <span className="font-medium">{module.difficulty}</span>
                            <span>{module.duration}</span>
                          </div>

                          <button
                            onClick={() => setSelectedModule(module.id)}
                            className="w-full py-2.5 md:py-2 text-sm font-medium rounded-lg transition-all duration-200"
                            style={{
                              backgroundColor: isCompleted ? 'transparent' : 'hsl(var(--primary))',
                              color: isCompleted ? 'hsl(var(--muted))' : 'white',
                              border: isCompleted ? '1px solid hsl(var(--border))' : 'none'
                            }}
                          >
                            {isCompleted ? 'Review module' : 'Start learning'}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="section pt-0 pb-12">
              <div className="container-wide">
                <h2 className="text-xl md:text-2xl font-semibold text-[hsl(var(--foreground))] text-center mb-6 md:mb-8">Your rewards</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {[
                    { badge: '💰', title: 'Bronze Tier', description: '1+ module: 5% lower interest', required: 1, achieved: completedModules.length >= 1 },
                    { badge: '📊', title: 'Silver Tier', description: '2+ modules: 10% lower interest', required: 2, achieved: completedModules.length >= 2 },
                    { badge: '🚀', title: 'Gold Tier', description: '3+ modules: 15% lower interest', required: 3, achieved: completedModules.length >= 3 },
                    { badge: '🏆', title: 'VIP Status', description: 'All modules: Full benefits', required: 5, achieved: completedModules.length >= 5 },
                  ].map((reward, index) => (
                    <div 
                      key={index} 
                      className={`rounded-xl p-5 md:p-6 border text-center transition-all ${reward.achieved ? 'opacity-100' : 'opacity-50'}`} 
                      style={{ backgroundColor: reward.achieved ? 'hsl(var(--card))' : 'hsl(var(--secondary))', borderColor: reward.achieved ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
                    >
                      <div className="text-2xl md:text-3xl mb-2">{reward.badge}</div>
                      <h3 className="text-base font-medium text-[hsl(var(--foreground))]">{reward.title}</h3>
                      <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted))' }}>{reward.description}</p>
                      <div className="mt-2 text-xs" style={{ color: reward.achieved ? 'hsl(var(--primary))' : 'hsl(var(--muted))' }}>
                        {reward.achieved ? '✓ Unlocked' : `${reward.required - completedModules.length} more to unlock`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
