import type mermaid from 'mermaid';

declare global {
  interface Window {
    mermaid: typeof mermaid;
  }
}
