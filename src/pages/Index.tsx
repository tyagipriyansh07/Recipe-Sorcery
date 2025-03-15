
import React from 'react';
import Header from '@/components/Header';
import RecipeForm from '@/components/RecipeForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl mx-auto py-12 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight mb-2">
            What's in Your Kitchen?
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter the ingredients you have on hand, and we'll generate a delicious recipe for you to try.
          </p>
        </div>
        
        <RecipeForm />
      </main>
    </div>
  );
};

export default Index;
