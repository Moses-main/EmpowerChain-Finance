import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LiteracyModule from '../components/LiteracyModeule';
import { ArrowLeft } from 'lucide-react';

export default function Learn() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = [
    {
      id: 'budgeting-101',
      title: 'Budgeting 101',
      description: 'Learn how to create and manage a business budget effectively.',
      difficulty: 'Beginner',
      duration: '15 min',
      nftBadge: '💰',
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
  ];

  const completedModules = ['budgeting-101'];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="section">
          <div className="container-narrow">
            <div className="rounded-xl p-6 md:p-8 border text-center" style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}>
              <h1 className="text-2xl md:text-3xl font-semibold text-[hsl(var(--foreground))] mb-2">Financial literacy hub</h1>
              <p className="text-base" style={{ color: 'hsl(var(--muted))' }}>Master practical finance skills and earn NFT badges that unlock better rates.</p>
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
              <LiteracyModule moduleId={selectedModule} {...modules.find((m) => m.id === selectedModule)!} />
            </div>
          </section>
        ) : (
          <>
            <section className="section pt-0">
              <div className="container-wide">
                <h2 className="text-xl md:text-2xl font-semibold text-[hsl(var(--foreground))] text-center mb-6 md:mb-8">Available modules</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {modules.map((module) => {
                    const isCompleted = completedModules.includes(module.id);
                    return (
                      <article key={module.id} className="rounded-xl border overflow-hidden transition-all duration-200" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                        <div className="h-24 md:h-28 flex items-center justify-center relative" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
                          <span className="text-2xl md:text-3xl">{module.nftBadge}</span>
                          {isCompleted && (
                            <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium text-white" style={{ backgroundColor: 'hsl(var(--primary))' }}>
                              Completed
                            </div>
                          )}
                        </div>

                        <div className="p-4 md:p-6">
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

            <section className="section pt-0">
              <div className="container-wide">
                <h2 className="text-xl md:text-2xl font-semibold text-[hsl(var(--foreground))] text-center mb-6 md:mb-8">Unlock rewards</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {[
                    { badge: '💰', title: '5% Lower Interest', description: 'Complete 1 module to reduce your loan APR by 5%' },
                    { badge: '📊', title: '10% Lower Interest', description: 'Complete 2 modules to reduce your loan APR by 10%' },
                    { badge: '🚀', title: 'VIP Status', description: 'Complete all modules to unlock VIP benefits and priority support' },
                  ].map((reward, index) => (
                    <div key={index} className="rounded-xl p-5 md:p-6 border text-center" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                      <div className="text-2xl md:text-3xl mb-2">{reward.badge}</div>
                      <h3 className="text-base font-medium text-[hsl(var(--foreground))]">{reward.title}</h3>
                      <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted))' }}>{reward.description}</p>
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
