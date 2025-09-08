import React from 'react';

const TrainingHeader = ({ icon, badgeText, title, description }) => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
        {icon}
        <span className="text-sm font-medium text-primary">{badgeText}</span>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
        {title}
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
};

export default TrainingHeader;