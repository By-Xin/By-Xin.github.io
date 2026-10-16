export type Publication = {
  title: string;
  authors: string;
  venue: string;
  href: string;
  pdf?: string;
  summary?: string;
  code?: string;
};

// Add public papers here, newest first. The homepage displays this section
// below Notes once there are entries. Keep unpublished work unlisted.
export const publications: Publication[] = [
  {
    title: "Optimal First-Order Methods for a Class of Structured Hölder-Smooth Problems",
    authors: "Baiying Xin, Qi Deng",
    venue: "2026 · arXiv:2610.21595 · Preprint",
    href: "https://arxiv.org/abs/2610.21595",
    pdf: "https://arxiv.org/pdf/2610.21595",
    summary: String.raw`For $\min_u \frac{1}{p}\lVert Au-b\rVert_p^p+\omega(u)$, $1\le p<2$, we develop a smoothing-based first-order method with an $\mathcal{O}(\varepsilon^{-1/p})$ matrix–vector complexity and prove a matching $\Omega(\varepsilon^{-1/p})$ lower bound for deterministic algorithms.`,
  },
];
