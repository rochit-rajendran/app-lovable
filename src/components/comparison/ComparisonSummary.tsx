import { ComparisonSubject } from '@/types/comparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllUoPCategories, getAllSDGs, getComparableKPIs, formatKPIDisplay } from '@/lib/comparisonAggregation';

interface ComparisonSummaryProps {
  subjects: ComparisonSubject[];
}

export function ComparisonSummary({ subjects }: ComparisonSummaryProps) {
  if (subjects.length < 2) return null;

  const insights: string[] = [];

  // UoP focus
  const categories = getAllUoPCategories(subjects);
  categories.forEach(cat => {
    let maxSubject: ComparisonSubject | null = null;
    let maxPct = 0;
    subjects.forEach(s => {
      const uop = s.uopAllocation.find(u => u.category === cat);
      if (uop && uop.percentage > maxPct) {
        maxPct = uop.percentage;
        maxSubject = s;
      }
    });
    // Only highlight if meaningfully different (>10pp gap)
    if (maxSubject && maxPct > 25) {
      const otherMax = Math.max(
        ...subjects
          .filter(s => s.id !== maxSubject!.id)
          .map(s => s.uopAllocation.find(u => u.category === cat)?.percentage || 0)
      );
      if (maxPct - otherMax > 10) {
        insights.push(`${maxSubject.label} allocates more capital to ${cat} (${maxPct.toFixed(0)}% vs ${otherMax.toFixed(0)}%).`);
      }
    }
  });

  // SDG focus
  const sdgs = getAllSDGs(subjects);
  sdgs.forEach(sdg => {
    const presentIn = subjects.filter(s => s.sdgAllocation.some(a => a.sdgNumber === sdg.sdgNumber));
    if (presentIn.length === 1) {
      insights.push(`SDG ${sdg.sdgNumber} (${sdg.sdgName}) is uniquely addressed by ${presentIn[0].label}.`);
    }
  });

  // Impact KPI leaders
  const comparableKPIs = getComparableKPIs(subjects);
  comparableKPIs.forEach(key => {
    const [name, unit] = key.split('|');
    let maxSubject: ComparisonSubject | null = null;
    let maxNorm = 0;
    subjects.forEach(s => {
      const kpi = s.impactKPIs.find(k => k.name === name && k.unit === unit);
      if (kpi && kpi.normalizedValue > maxNorm) {
        maxNorm = kpi.normalizedValue;
        maxSubject = s;
      }
    });
    if (maxSubject && maxNorm > 0) {
      insights.push(
        `${maxSubject.label} delivers higher ${name.toLowerCase()} per € invested (${formatKPIDisplay(maxNorm)} ${unit} per €1M).`
      );
    }
  });

  if (insights.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Summary Differences</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {insights.slice(0, 6).map((insight, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
              <p className="text-sm text-foreground">{insight}</p>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-muted-foreground italic mt-4">
          Factual observations based on reported data. No rankings or scoring implied.
        </p>
      </CardContent>
    </Card>
  );
}
