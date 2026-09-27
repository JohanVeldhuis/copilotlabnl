export const topics = [
  { slug: 'prompting', label: 'Slimmer prompten' },
] as const;

export function isTopic(value: string) {
  return topics.some((topic) => topic.slug === value);
}

export function topicLabel(value: string) {
  return topics.find((topic) => topic.slug === value)?.label ?? value;
}
