import { Framework } from '@/types/framework';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareQuote } from 'lucide-react';

interface SPOSummaryProps {
  framework: Framework;
}

export function SPOSummary({ framework }: SPOSummaryProps) {
  if (!framework.spoSummary || !framework.spoProvider) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
          Second Party Opinion Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="border-l-2 border-accent/40 pl-4 py-1">
          <p className="text-sm text-foreground leading-relaxed">
            {framework.spoSummary}
          </p>
        </blockquote>
        <p className="text-xs text-muted-foreground mt-3">
          Summary based on Second Party Opinion by{' '}
          <span className="font-medium text-foreground">{framework.spoProvider}</span>
          {framework.spoDate && (
            <>, published {new Date(framework.spoDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
