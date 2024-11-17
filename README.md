# QuillMermaid

A Quill.js module to add Mermaid support. Help you to write flowcharts, sequence diagrams, gantt charts and more.

If you are familiar with Markdown you should have no problem learning [Mermaid's Syntax](https://mermaid.js.org/intro/syntax-reference.html).

[Demo](https://zzxming.github.io/quill-mermaid-chart/)

## Usage

Makesure mermaid is loaded on window

```js
import QuillMermaid from 'quill-mermaid';

Quill.register({
  'modules/mermaid': QuillMermaid,
}, true);

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block', 'code'],
      ['link', 'image', 'video', 'formula'],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      // add mermaid chart button
      ['mermaid-chart'],
    ],
    mermaid: true
  },
});
```
