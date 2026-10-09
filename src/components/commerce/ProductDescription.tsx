import React from 'react';
import { Check } from 'lucide-react';

// Renders the catalog's plain-text product description:
//   intro paragraph(s)
//   "Key features" followed by "• ..." lines  -> heading + checklist
//   "Fits: ...", "Certification: ..."          -> label + value
// Text only, never HTML, so nothing from the catalog is injected into the page.

const LABEL = /^(Fits|Certification|Colours?|Available in|Sizes?|Grade|Finish|Length|Volume|Scale|Includes|For)\b:?\s*(.*)$/;

type Block =
  | { kind: 'text'; lines: string[] }
  | { kind: 'list'; heading?: string; items: string[] }
  | { kind: 'labels'; rows: { label: string; value: string }[] };

function parse(description: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of description.replace(/\r\n/g, '\n').split(/\n\s*\n/)) {
    const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    const bullets = lines.filter((l) => l.startsWith('•'));
    if (bullets.length > 0) {
      const heading = lines[0].startsWith('•') ? undefined : lines[0].replace(/:$/, '');
      blocks.push({ kind: 'list', heading, items: bullets.map((l) => l.replace(/^•\s*/, '')) });
      continue;
    }
    const labelled = lines.map((l) => l.match(LABEL));
    if (labelled.every((m) => m && m[2] && m[0].length < 400)) {
      blocks.push({ kind: 'labels', rows: labelled.map((m) => ({ label: m![1], value: m![2] })) });
      continue;
    }
    blocks.push({ kind: 'text', lines });
  }
  return blocks;
}

export const ProductDescription: React.FC<{ description: string }> = ({ description }) => {
  const blocks = parse(description);
  if (blocks.length === 0) {
    return <p className="text-xs text-neutral-500">No description yet.</p>;
  }
  return (
    <div className="space-y-5 text-sm text-neutral-700 leading-relaxed max-w-3xl">
      {blocks.map((block, i) => {
        if (block.kind === 'list') {
          return (
            <div key={i}>
              {block.heading && <h4 className="text-xs font-bold uppercase tracking-wide text-neutral-950 mb-3">{block.heading}</h4>}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start space-x-2 text-xs text-neutral-800">
                    <Check className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        if (block.kind === 'labels') {
          return (
            <dl key={i} className="space-y-1.5 text-xs">
              {block.rows.map((row, j) => (
                <div key={j} className="flex flex-wrap gap-x-2">
                  <dt className="font-bold text-neutral-950">{row.label}:</dt>
                  <dd className="text-neutral-700 whitespace-pre-line">{row.value}</dd>
                </div>
              ))}
            </dl>
          );
        }
        return block.lines.map((line, j) => (
          <p key={`${i}-${j}`}>{line}</p>
        ));
      })}
    </div>
  );
};
