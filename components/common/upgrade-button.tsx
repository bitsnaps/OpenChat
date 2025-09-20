'use client';

import { useState } from 'react';
import { useUser } from '@/app/providers/user-provider';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from './upgrade-modal';

export function UpgradeButton() {
  const { user, hasPremium, isLoading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Don't show for anonymous users, premium users, or while loading
  if (!user || user.isAnonymous || hasPremium || isLoading) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        size="sm"
        variant="outline"
      >
        Upgrade
      </Button>
      <UpgradeModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
