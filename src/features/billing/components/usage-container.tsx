import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useCheckout } from '../hooks/use-checkout';

function formatCurrency(
  amount: number,
  locale: string = 'zh-CN',
  currency: string = 'CNY',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
  }).format(amount);
}

function UpgradeCard() {
  const { checkout, isPending: isCheckoutPending } = useCheckout();

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold tracking-tight text-foreground">Pay as you go</p>
        <p className="text-xs text-muted-foreground mt-1">
          Generate speech starting at ¥0.043 per 1,000 characters
        </p>
      </div>
      <Button
        variant={'outline'}
        className="w-full text-xs"
        size="sm"
        disabled={isCheckoutPending}
        onClick={checkout}
      >
        {isCheckoutPending ? (
          <>
            <Spinner className="size-3" />
            Redirecting...
          </>
        ) : (
          'Upgrade'
        )}
      </Button>
    </div>
  );
}

function UsageCard({ estimatedCostCents }: { estimatedCostCents: number }) {
  const trpc = useTRPC();
  const portalMutation = useMutation(trpc.billing.createPortalSession.mutationOptions({}));

  const openPortal = useCallback(() => {
    portalMutation.mutate(undefined, {
      onSuccess: (data) => {
        window.open(data.portaUrl, '_blank');
      },
    });
  }, [portalMutation]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold tracking-tight text-foreground">Current usage</p>
        <p className="text-xl font-bold tracking-tight text-foreground mt-1">
          {formatCurrency(estimatedCostCents)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">Estimated this period</p>
      </div>
      <Button
        variant={'outline'}
        className="w-full text-xs"
        size="sm"
        disabled={portalMutation.isPending}
        onClick={openPortal}
      >
        {portalMutation.isPending ? (
          <>
            <Spinner className="size-3" />
            Redirecting...
          </>
        ) : (
          'Manage Subscription'
        )}
      </Button>
    </div>
  );
}

export function UsageContainer() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.billing.getStatus.queryOptions());

  return (
    <div className="group-data-[collapsible=icon]:hidden bg-background border border-border rounded-lg p-3">
      {data?.hasActiveSubscription ? (
        <UsageCard estimatedCostCents={data.estimatedCostCents} />
      ) : (
        <UpgradeCard />
      )}
    </div>
  );
}
