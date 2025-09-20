'use client';

import { DiamondIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useUser } from '@/app/providers/user-provider';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from './upgrade-modal';

export function UpgradeButton() {
  const { user, hasPremium } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Don't show for anonymous users or premium users
  if (!user || user.isAnonymous || hasPremium) {
    return null;
  }

  return (
    <>
      <Button
        className="gap-1.5"
        onClick={() => setIsModalOpen(true)}
        size="sm"
        variant="default"
      >
        <DiamondIcon className="size-4" weight="bold" />
        Upgrade
      </Button>
      <UpgradeModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
