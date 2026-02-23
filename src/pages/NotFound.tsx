import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-24 px-6">
        <div className="max-w-md w-full card p-8 elevate text-center">
          <h1 className="text-4xl font-semibold text-[hsl(var(--foreground))] mb-2">404</h1>
          <p className="text-[hsl(var(--muted))] mb-6">We couldn't find the page you're looking for.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 btn-primary font-medium">
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}