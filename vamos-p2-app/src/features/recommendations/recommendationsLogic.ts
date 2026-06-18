import type { Activity } from '../activities/activitiesApi';
import type { UserProfile } from '../../shared/types/user';

const BUDGET_MAX: Record<string, number> = {
  low:    30,
  medium: 60,
  high:   Infinity,
};

export interface ScoredActivity {
  activity: Activity;
  score: number;
  reasons: string[];
}

export function scoreActivities(activities: Activity[], profile: UserProfile): ScoredActivity[] {
  const maxPrice = BUDGET_MAX[profile.budget ?? 'high'] ?? Infinity;

  return activities
    .map(activity => {
      let score = 0;
      const reasons: string[] = [];

      // +3 interest match
      if ((profile.interests as string[]).includes(activity.category)) {
        score += 3;
        reasons.push('Matches your interests');
      }

      // +2 within budget
      if (activity.price <= maxPrice) {
        score += 2;
        reasons.push('Within your budget');
      }

      // +1 urgency — almost full
      if (activity.slotsLeft > 0 && activity.slotsLeft < 5) {
        score += 1;
        reasons.push('Almost full');
      }

      return { activity, score, reasons };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
