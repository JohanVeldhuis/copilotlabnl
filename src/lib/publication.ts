interface PublicationData {
  draft: boolean;
  published: string;
}

export function isArticleVisible(data: PublicationData, now = new Date()) {
  return !data.draft && Date.parse(data.published) <= now.getTime();
}
