import { ReactNode } from "react";

// Tiny markdown renderer — supports **bold**, > quote, - list, paragraphs.
// No external dep. Returns ReactNode tree.

const renderInline = (text: string, keyPrefix = ""): ReactNode[] => {
  const parts: ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={`${keyPrefix}-b-${i++}`} className="font-display text-primary font-semibold">
        {match[1]}
      </strong>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
};

interface RenderOptions {
  /** If true, the first paragraph is rendered as a "lead" (bigger, accented). */
  detectLead?: boolean;
}

export const renderRichText = (raw: string, opts: RenderOptions = {}): ReactNode => {
  const text = (raw ?? "").trim();
  if (!text) return null;

  // Split into blocks separated by blank lines
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const out: ReactNode[] = [];
  let listBuffer: string[] = [];
  let quoteBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    out.push(
      <ul key={`l-${key}`} className="my-4 space-y-2">
        {listBuffer.map((item, i) => (
          <li key={i} className="flex gap-3 items-start text-foreground/90 leading-relaxed">
            <span className="text-primary font-bold mt-1 leading-none">✦</span>
            <span>{renderInline(item, `li-${key}-${i}`)}</span>
          </li>
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  const flushQuote = (key: string) => {
    if (quoteBuffer.length === 0) return;
    out.push(
      <blockquote
        key={`q-${key}`}
        className="my-4 rounded-xl bg-primary/5 border-l-4 border-primary px-4 py-3 italic text-foreground/85"
      >
        {quoteBuffer.map((line, i) => (
          <p key={i} className="leading-relaxed">{renderInline(line, `q-${key}-${i}`)}</p>
        ))}
      </blockquote>,
    );
    quoteBuffer = [];
  };

  blocks.forEach((block, bIdx) => {
    const lines = block.split("\n").map((l) => l.trim());
    const isList = lines.every((l) => l.startsWith("- "));
    const isQuote = lines.every((l) => l.startsWith("> "));

    if (isList) {
      flushQuote(`b${bIdx}`);
      listBuffer.push(...lines.map((l) => l.replace(/^-\s+/, "")));
      flushList(`b${bIdx}`);
      return;
    }

    if (isQuote) {
      flushList(`b${bIdx}`);
      quoteBuffer.push(...lines.map((l) => l.replace(/^>\s+/, "")));
      flushQuote(`b${bIdx}`);
      return;
    }

    flushList(`b${bIdx}`);
    flushQuote(`b${bIdx}`);

    const joined = lines.join(" ");
    const isLead = opts.detectLead && bIdx === 0;
    if (isLead) {
      out.push(
        <p
          key={`p-${bIdx}`}
          className="font-display text-xl sm:text-2xl leading-snug text-foreground border-l-4 border-primary pl-4 mb-5"
        >
          {renderInline(joined, `lead-${bIdx}`)}
        </p>,
      );
    } else {
      out.push(
        <p key={`p-${bIdx}`} className="text-base leading-[1.7] text-foreground/90 mb-4 last:mb-0 max-w-[60ch]">
          {renderInline(joined, `p-${bIdx}`)}
        </p>,
      );
    }
  });

  flushList("end");
  flushQuote("end");

  return <>{out}</>;
};

/** Estimate read time in seconds (220 wpm). */
export const estimateReadSeconds = (text: string): number => {
  const words = (text ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(5, Math.round((words / 220) * 60));
};

/** Stable hash for change-detection on lesson text (FNV-1a). */
export const textHash = (text: string): string => {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
};
