export const contestPlatforms = [
  'codeforces',
  'codechef',
  'atcoder',
  'leetcode',
  'hackerrank',
  'hackerearth',
  'topcoder',
  'kickstart',
  'other'
] as const;

export type ContestPlatform = typeof contestPlatforms[number];
export type Contest = {
  platform: ContestPlatform;
  name: string;
  url: string;
  startTime: string;
  duration: number; // in seconds
  type?: 'contest' | 'challenge' | 'competition';
};