export const events = {
  mermaidModeChange: 'mermaid-mode-change',
  mermaidTextChange: 'mermaid-text-change',
};
export const dataKey = Symbol('mermaid-data');
export const chartTemplate = {
  flowchart: `graph LR
  A[Start] --> B{Is it?};
  B -->|Yes| C[OK];
  C --> D[Rethink];
  D --> B;
  B ---->|No| E[End];
`,
};
