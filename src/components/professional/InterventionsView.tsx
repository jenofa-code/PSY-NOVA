import React from 'react';
import { FollowUpsView } from './FollowUpsView';

interface InterventionsViewProps {
  onSelectCase: (caseId: string) => void;
}

export const InterventionsView: React.FC<InterventionsViewProps> = ({ onSelectCase }) => {
  return <FollowUpsView onSelectCase={onSelectCase} />;
};
