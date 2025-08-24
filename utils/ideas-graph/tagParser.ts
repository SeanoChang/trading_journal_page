import type { ParsedTag } from '../../types/ideas-graph';

export function parseNestedTags(tags: string[]): ParsedTag[] {
  const parsed: ParsedTag[] = [];
  
  tags.forEach(tag => {
    if (tag.includes('/')) {
      const parts = tag.split('/');
      parts.forEach((part, index) => {
        const name = parts.slice(0, index + 1).join('/');
        const parent = index > 0 ? parts.slice(0, index).join('/') : undefined;
        if (!parsed.find(p => p.name === name)) {
          parsed.push({ name, parent, level: index });
        }
      });
    } else {
      if (!parsed.find(p => p.name === tag)) {
        parsed.push({ name: tag, level: 0 });
      }
    }
  });
  
  return parsed;
}

