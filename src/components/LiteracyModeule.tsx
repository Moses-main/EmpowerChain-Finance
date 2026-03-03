import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Lock, Award } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface LiteracyModuleProps {
  moduleId: string;
  title: string;
  description: string;
  questions: Question[];
  nftBadge: string;
  tier?: string;
  onComplete?: (moduleId: string, score: number, passed: boolean) => void;
}

const LiteracyModule: React.FC<LiteracyModuleProps> = ({ moduleId, title, description, questions, nftBadge, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((c) => c + 1);
        setSelectedAnswer(null);
      } else {
        setCompleted(true);
        if (onComplete) {
          const passPercentage = (score / questions.length) * 100;
          const isPassed = passPercentage >= 70;
          onComplete(moduleId, Math.round(passPercentage), isPassed);
        }
      }
    }, 900);
  };

  const passPercentage = (score / questions.length) * 100;
  const isPassed = passPercentage >= 70;

  if (completed) {
    return (
      <div className="rounded-xl p-6 md:p-8 border text-center" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', boxShadow: 'var(--shadow-md)' }}>
        <div className="mb-4">
          {isPassed ? <Award className="w-10 h-10 md:w-12 md:h-12 mx-auto" style={{ color: 'hsl(var(--primary))' }} /> : <Lock className="w-10 h-10 md:w-12 md:h-12 mx-auto" style={{ color: 'hsl(var(--muted))' }} />}
        </div>
        <h3 className="text-xl font-medium text-[hsl(var(--foreground))]">{isPassed ? 'Well done!' : 'Keep going'}</h3>
        <p className="mt-2 text-base" style={{ color: 'hsl(var(--muted))' }}>You scored {score} / {questions.length} ({Math.round(passPercentage)}%)</p>

        {isPassed && (
          <div className="mt-6 rounded-lg p-4 inline-block" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
            <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>NFT Badge</div>
            <div className="mt-2 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-lg mx-auto text-2xl md:text-3xl text-white" style={{ backgroundColor: 'hsl(var(--primary))' }}>
              {nftBadge}
            </div>
            <div className="mt-2 text-xs" style={{ color: 'hsl(var(--muted))' }}>Unlocks lower interest rates</div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button className="px-5 py-2.5 text-sm font-medium rounded-lg text-white" style={{ backgroundColor: 'hsl(var(--primary))' }}>Claim Badge</button>
          <button className="px-5 py-2.5 text-sm font-medium rounded-lg border" style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>Retake</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-5 md:p-8 border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', boxShadow: 'var(--shadow-md)' }}>
      <div className="mb-5 md:mb-6">
        <h2 className="text-lg md:text-xl font-medium text-[hsl(var(--foreground))]">{title}</h2>
        <p className="mt-2 text-sm" style={{ color: 'hsl(var(--muted))' }}>{description}</p>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 rounded-full h-2" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, backgroundColor: 'hsl(var(--primary))' }}
            />
          </div>
          <div className="text-sm font-medium" style={{ color: 'hsl(var(--muted))' }}>
            {currentQuestion + 1}/{questions.length}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.24 }}
        >
          <h3 className="text-base md:text-lg font-medium text-[hsl(var(--foreground))] mb-4">{questions[currentQuestion].question}</h3>

          <div className="space-y-2.5 md:space-y-3">
            {questions[currentQuestion].options.map((opt, idx) => {
              const selected = selectedAnswer === idx;
              const correct = questions[currentQuestion].correctAnswer === idx;
              const base = 'w-full text-left p-3.5 md:p-4 rounded-lg font-medium text-sm transition-all duration-200';
              const classes = selected
                ? correct
                  ? `${base} text-white`
                  : `${base} bg-opacity-50`
                : `${base} border text-[hsl(var(--foreground))] hover:shadow-sm`;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  className={classes}
                  style={{
                    backgroundColor: selected ? (correct ? 'hsl(var(--primary))' : 'hsl(var(--secondary))') : 'white',
                    borderColor: selected ? 'transparent' : 'hsl(var(--border))',
                    color: selected ? (correct ? 'white' : 'hsl(var(--muted))') : 'hsl(var(--foreground))',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {selected && correct && <CheckCircle className="w-5 h-5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LiteracyModule;
