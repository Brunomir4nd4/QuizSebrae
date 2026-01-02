'use client';

import { Submission } from '@/types/ISubmission';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode
} from 'react';

type SubmissionsContextType = {
  submissions: Submission[];
  addSubmissions: (submission: Submission[]) => void;
  clearSubmissions: () => void;
  setAllSubmissions: (subs: Submission[]) => void;
};

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(
  undefined
);

export const SubmissionsProvider = ({
  children,
  initialSubmissions = [],
}: {
  children: ReactNode;
  initialSubmissions?: Submission[];
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);

  const addSubmissions = (newSubmissions: Submission[]) => {
    setSubmissions((prev) => {
      const updated = [...prev];

      newSubmissions.forEach((newItem) => {
        const index = updated.findIndex((item) => item.id == newItem.id);
        if (index !== -1) {
          updated[index] = newItem;
        } else {
          updated.push(newItem);
        }
      });

      return updated.sort((a, b) => Number(a.id) - Number(b.id));
    });
  };

  const clearSubmissions = () => {
    setSubmissions([]);
  };

  const setAllSubmissions = (subs: Submission[]) => {
    setSubmissions(subs);
  };

  return (
    <SubmissionsContext.Provider
      value={{ submissions, addSubmissions, clearSubmissions, setAllSubmissions }}
    >
      {children}
    </SubmissionsContext.Provider>
  );
};

export const useSubmissions = () => {
  const context = useContext(SubmissionsContext);
  if (!context)
    throw new Error('useSubmissions must be used within a SubmissionsProvider');
  return context;
};
