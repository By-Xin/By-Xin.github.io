export type Publication = {
  title: string;
  authors: string;
  venue: string;
  href: string;
  code?: string;
};

// Add public papers here, newest first. The homepage displays this section
// below Notes once there are entries. Keep unpublished work unlisted.
export const publications: Publication[] = [];
