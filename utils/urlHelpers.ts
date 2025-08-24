export const absolutize = (maybeUrl: string | undefined, base: string): string | undefined => {
  if (!maybeUrl) return undefined;
  try {
    if (maybeUrl.startsWith("//")) return `https:${maybeUrl}`;
    const u = new URL(maybeUrl, base);
    return u.toString();
  } catch {
    return undefined;
  }
};

export const firstFromSrcset = (srcset?: string): string | undefined => {
  if (!srcset) return undefined;
  const first = srcset.split(",")[0]?.trim();
  const url = first?.split(" ")[0];
  return url;
};

export const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace("www.", "");
  } catch {
    return url;
  }
};

export const domainFrom = (url: string): string => {
  return extractDomain(url);
};