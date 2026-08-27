export function extractProductUrl(rawValue: string): string | null {
  const value = rawValue.trim();

  if (!value) {
    return null;
  }

  const match = value.match(/https?:\/\/[^\s)>'"]+/i);

  if (!match) {
    return null;
  }

  return match[0].replace(/[).,;!]+$/, "");
}
