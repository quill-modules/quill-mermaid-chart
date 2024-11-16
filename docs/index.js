const Quill = window.Quill;
const mermaid = window.mermaid;

Quill.register({
  'modules/mermaid': bundle.QuillMermaid,
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
      ['mermaid-chart'],
    ],
    mermaid: {

    },
  },
});

btn.addEventListener('click', () => {
  const content = quill.getContents();
  console.log(content);
  output.innerHTML = '';
  // eslint-disable-next-line unicorn/no-array-for-each
  content.forEach((content) => {
    const item = document.createElement('li');
    item.textContent = `${JSON.stringify(content)},`;
    output.appendChild(item);
  });
});

quill.setContents([
  {
    insert: '\n',
  },
  {
    insert: {
      'mermaid-chart': `%%{init: {"flowchart": {"htmlLabels": false}} }%%
flowchart LR
    markdown["\`This **is** _Markdown_\`"]
    newLines["\`Line1
    Line 2
    Line 3\`"]
    markdown --> newLines`,
    },
  },
  {
    insert: '\n',
  },
  {
    insert: {
      'mermaid-chart': `sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!`,
    },
  },
  {
    insert: '\n',
  },
  {
    insert: {
      'mermaid-chart': `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`,
    },
  },
]);
