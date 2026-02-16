import { FrameworkAlignment as FrameworkAlignmentType, ExternalReview } from '@/types/esg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, MinusCircle, FileCheck, Shield, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockFrameworks } from '@/data/mockFrameworks';

interface FrameworkAlignmentProps {
  frameworks: FrameworkAlignmentType[];
  externalReviews: ExternalReview[];
  issuerName?: string;
}

function AlignmentIcon({ status }: { status: string }) {
  switch (status) {
    case 'Aligned':
      return <CheckCircle2 className="h-4 w-4 text-accent" />;
    case 'Partially Aligned':
      return <AlertCircle className="h-4 w-4 text-warning" />;
    default:
      return <MinusCircle className="h-4 w-4 text-muted-foreground" />;
  }
}

function ReviewTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    SPO: 'bg-info/10 text-info',
    Verification: 'bg-accent/10 text-accent',
    Certification: 'bg-esg-g/10 text-esg-g',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${styles[type] || 'bg-muted text-muted-foreground'}`}>
      {type}
    </span>
  );
}

export function FrameworkAlignmentSection({ frameworks, externalReviews, issuerName }: FrameworkAlignmentProps) {
  // Find matching detailed framework objects for linking
  const detailedFrameworks = issuerName
    ? Object.values(mockFrameworks).filter(f => f.issuer === issuerName)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Frameworks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            Framework Alignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {frameworks.map((fw, idx) => {
              // Try to find a matching detailed framework
              const detailedFw = detailedFrameworks.find(d =>
                fw.framework.includes(d.alignments[0]?.standard?.split(' ')[0] || '__none__') === false
                  ? d.name.toLowerCase().includes(fw.framework.split('(')[0].trim().toLowerCase().split(' ').slice(0, 2).join(' '))
                  : false
              );

              return (
                <div key={idx} className="flex items-center justify-between gap-3 py-2 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AlignmentIcon status={fw.status} />
                    <span className="text-sm text-foreground truncate">{fw.framework}</span>
                  </div>
                  <span className={`text-xs font-medium flex-shrink-0 ${
                    fw.status === 'Aligned' ? 'text-accent' : 
                    fw.status === 'Partially Aligned' ? 'text-warning' : 'text-muted-foreground'
                  }`}>
                    {fw.status}
                  </span>
                </div>
              );
            })}
            {detailedFrameworks.length > 0 && (
              <div className="pt-2">
                <Link
                  to={`/frameworks/${detailedFrameworks[0].id}`}
                  className="text-xs text-primary hover:underline underline-offset-2 inline-flex items-center gap-1"
                >
                  View full framework details
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* External Reviews */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-muted-foreground" />
            Reviews & Assurance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {externalReviews.map((review, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 py-2 border-b border-border/30 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{review.provider}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <ReviewTypeBadge type={review.type} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
