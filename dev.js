!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("quill")):"function"==typeof define&&define.amd?define(["exports","quill"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).bundle={},t.Quill)}(this,(function(t,e){"use strict";var i='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';const s="mermaid-mode-change",o=Symbol("mermaid-data"),n={flowchart:"graph LR\n  A[Start] --\x3e B{Is it?};\n  B --\x3e|Yes| C[OK];\n  C --\x3e D[Rethink];\n  D --\x3e B;\n  B ----\x3e|No| E[End];\n"},r=Symbol("histroy-stack"),l=/Mac/i.test(navigator.platform)?"metaKey":"ctrlKey";const a="function"==typeof Buffer;"function"==typeof TextDecoder&&new TextDecoder;const d="function"==typeof TextEncoder?new TextEncoder:void 0,c=Array.prototype.slice.call("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=");(t=>{let e={};t.forEach(((t,i)=>e[t]=i))})(c);const h=String.fromCharCode.bind(String);"function"==typeof Uint8Array.from&&Uint8Array.from.bind(Uint8Array);const m="function"==typeof btoa?t=>btoa(t):a?t=>Buffer.from(t,"binary").toString("base64"):t=>{let e,i,s,o,n="";const r=t.length%3;for(let r=0;r<t.length;){if((i=t.charCodeAt(r++))>255||(s=t.charCodeAt(r++))>255||(o=t.charCodeAt(r++))>255)throw new TypeError("invalid character found");e=i<<16|s<<8|o,n+=c[e>>18&63]+c[e>>12&63]+c[e>>6&63]+c[63&e]}return r?n.slice(0,r-3)+"===".substring(r):n},u=a?t=>Buffer.from(t).toString("base64"):t=>{let e=[];for(let i=0,s=t.length;i<s;i+=4096)e.push(h.apply(null,t.subarray(i,i+4096)));return m(e.join(""))},p=t=>{if(t.length<2)return(e=t.charCodeAt(0))<128?t:e<2048?h(192|e>>>6)+h(128|63&e):h(224|e>>>12&15)+h(128|e>>>6&63)+h(128|63&e);var e=65536+1024*(t.charCodeAt(0)-55296)+(t.charCodeAt(1)-56320);return h(240|e>>>18&7)+h(128|e>>>12&63)+h(128|e>>>6&63)+h(128|63&e)},g=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,f=a?t=>Buffer.from(t,"utf8").toString("base64"):d?t=>u(d.encode(t)):t=>m(t.replace(g,p)),v=(t,e,i)=>{t&&(t=t.cloneNode(!0)),i&&t.setAttribute("height",`${i}px`),e&&t.setAttribute("width",`${e}px`);return((t,e=!1)=>e?(t=>t.replace(/=/g,"").replace(/[+\/]/g,(t=>"+"==t?"-":"_")))(f(t)):f(t))(`${t.outerHTML.replaceAll("<br>","<br/>").replaceAll(/<img([^>]*)>/g,((t,e)=>`<img ${e} />`))}`)};function x(t,e,i,s,o){const{close:n}=(t=>{const e=document.createElement("div");e.classList.add("qmc-loading-mask");const i=document.createElement("div");return i.classList.add("qmc-loading-icon"),e.appendChild(i),t.appendChild(e),{close:()=>{e.remove()}}})(t);new Promise((async t=>{await async function(t,e,i,{config:s}={}){let o=null;try{window.mermaid.initialize(Object.assign({},{startOnLoad:!1,flowchart:{useMaxWidth:!1},sequence:{useMaxWidth:!1},gantt:{useMaxWidth:!1},journey:{useMaxWidth:!1},timeline:{useMaxWidth:!1},class:{useMaxWidth:!1},state:{useMaxWidth:!1},er:{useMaxWidth:!1},pie:{useMaxWidth:!1},quadrantChart:{useMaxWidth:!1},xyChart:{useMaxWidth:!1},requirement:{useMaxWidth:!1},architecture:{useMaxWidth:!1},mindmap:{useMaxWidth:!1},kanban:{useMaxWidth:!1},gitGraph:{useMaxWidth:!1},c4:{useMaxWidth:!1},sankey:{useMaxWidth:!1},packet:{useMaxWidth:!1},block:{useMaxWidth:!1}},s));if(await window.mermaid.parse(e)&&(o=await window.mermaid.render(`chart-${t}`,e,i)),o){const t=(t=>{const e=(new DOMParser).parseFromString(t,"text/html"),i=document.createElement("canvas"),s=e.querySelector("svg");if(!s)throw new Error("svg not found");let o=Number(s.getAttribute("width")),n=Number(s.getAttribute("height"));isNaN(o)&&(o=0),isNaN(n)&&(n=0),i.width=o,i.height=n;const r=i.getContext("2d");if(!r)throw new Error("context not found");return r.fillStyle=`hsl(${window.getComputedStyle(document.body).getPropertyValue("--b1")})`,r.fillRect(0,0,i.width,i.height),`data:image/svg+xml;base64,${v(s,i.width,i.height)}`})(o.svg),e=new Image;e.src=t,i.innerHTML="",i.appendChild(e)}}catch(t){console.error(t),i.innerHTML=t.message}return o}(e,i,s,o),n(),t()}))}function w(t,e){t.addEventListener("scroll",e),this.scrollHandler.push([t,e])}function y(){for(let t=0;t<this.scrollHandler.length;t++){const[e,i]=this.scrollHandler[t];e.removeEventListener("scroll",i)}this.scrollHandler=[]}const b=e.import("blots/block/embed");class C extends b{static tagName="div";static blotName="mermaid-chart";static className="ql-mermaid-chart";static create(t){t||(t=n.flowchart);const e=super.create();e.setAttribute("contenteditable","false"),e[o]=t;const i=Math.random().toString(36).slice(2);e.dataset.id=i;const s=document.createElement("div");return s.classList.add("chart"),e.appendChild(s),x(e,i,t,s),e}static value(t){return t[o]||""}get id(){return this.domNode.dataset.id}get text(){return this.domNode[o]}set text(t){this.domNode[o]=t,x(this.domNode,this.id,t,this.getChart())}getChart(){return this.domNode.querySelector(".chart")}}class L{el;options;constructor(t,e){this.options=this.resolveOptions(e),t[r]={redo:[],undo:[]},this.el=t,this.el.addEventListener("beforeinput",(t=>{t.isComposing||this.record(this.el.value,[this.el.selectionStart,this.el.selectionEnd])}));let i={value:"",range:[0,0]};this.el.addEventListener("compositionstart",(()=>{i={value:this.el.value,range:[this.el.selectionStart,this.el.selectionEnd]}})),this.el.addEventListener("compositionend",(()=>{this.record(i.value,i.range)}))}resolveOptions(t={}){return Object.assign({maxStack:100},t)}record(t,e){this.el[r].redo=[],this.el[r].undo.push({value:t,range:e}),this.el[r].undo.length>this.options.maxStack&&this.el[r].undo.shift()}undo(){const t=this.el[r].undo.pop();t&&(this.el[r].redo.push({value:this.el.value,range:[this.el.selectionStart,this.el.selectionEnd]}),this.el.value=t.value,this.el.setSelectionRange(...t.range))}redo(){const t=this.el[r].redo.pop();t&&(this.el[r].undo.push({value:this.el.value,range:[this.el.selectionStart,this.el.selectionEnd]}),this.el.value=t.value,this.el.setSelectionRange(...t.range))}}class E{quill;mermaidBlot;closeEditor;options;editor;preview;chart;textInput;histroyStackOptions;constructor(t,e,s,o){this.quill=t,this.mermaidBlot=e,this.options=this.resolveOptions(s),this.histroyStackOptions=o;const{dialog:n,close:r}=(t=>{const{appendTo:e=document.body,title:s,description:o,content:n,confirm:r=!0,cancel:l=!0,clickMaskClose:a=!0,onClose:d,onShow:c,onConfirm:h}=t||{},m=document.createElement("div");m.classList.add("qmc-mask");const u=document.createElement("div");u.classList.add("qmc-dialog");const p=()=>{for(const t of[m,u])t.classList.remove("open"),t.classList.add("close"),t.addEventListener("transitionend",(()=>{t.remove()}),{once:!0});document.removeEventListener("keydown",f),d&&d()};if(s||o){const t=document.createElement("div");if(t.classList.add("qmc-dialog-header"),s){const e=document.createElement("h3");e.classList.add("qmc-dialog-title"),e.textContent=s,t.appendChild(e)}if(o){const e=document.createElement("p");e.classList.add("qmc-dialog-description"),e.textContent=o,t.appendChild(e)}u.appendChild(t)}if(n){const t=document.createElement("div");t.classList.add("qmc-dialog-content"),t.appendChild(n),u.appendChild(t)}if(r||l){const t=document.createElement("div");if(t.classList.add("qmc-dialog-footer"),l){const e=document.createElement("button");e.classList.add("qmc-dialog-btn","qmc-dialog-cancel"),e.textContent="Cancel",e.addEventListener("click",(()=>p())),t.appendChild(e)}if(r){const e=document.createElement("button");e.classList.add("qmc-dialog-btn","qmc-dialog-confirm"),e.textContent="Confirm",e.addEventListener("click",(async()=>{h&&await h(),p()})),t.appendChild(e)}u.appendChild(t)}const g=document.createElement("button");g.classList.add("qmc-dialog-btn","qmc-dialog-close"),g.innerHTML=i,u.appendChild(g);const f=t=>{"Escape"===t.code&&p()};return a&&m.addEventListener("click",p),g.addEventListener("click",p),document.addEventListener("keydown",f),u.addEventListener("click",(t=>t.stopPropagation())),u.addEventListener("keydown",(t=>t.stopPropagation())),e.appendChild(m),e.appendChild(u),setTimeout((()=>{m.classList.add("open"),u.classList.add("open"),u.addEventListener("transitionend",(()=>{c&&c()}),{once:!0})})),{mask:m,dialog:u,close:p}})({content:this.createEditor(),onClose:this.options.onClose,onShow:()=>this.updatePreview(),clickMaskClose:this.options.dialogMaskClickClose,onConfirm:()=>{this.mermaidBlot.text=this.getInputText()},cancel:!1});this.closeEditor=r,n.style.maxWidth=`${Math.min(1024,.8*window.innerWidth)}px`}resolveOptions(t){return Object.assign({dialogMaskClickClose:!0,onClose:()=>{}},t)}updatePreview(){x(this.preview,"preview",this.getInputText(),this.chart)}getInputText(){return this.textInput.el.value}bindInputEvent(){const t=function(t,e){let i;return function(...s){null!==i&&clearTimeout(i),i=setTimeout((()=>{t.apply(this,s),i=null}),e)}}((()=>{this.updatePreview()}),500);this.textInput.el.addEventListener("keydown",(e=>{let i=!1;if("Tab"===e.code){e.preventDefault();const{selectionStart:t,selectionEnd:s}=this.textInput.el,o=e.target;o.value=`${o.value.slice(0,t)}  ${o.value.slice(s)}`,o.setSelectionRange(t+2,t+2),i=!0}e[l]&&"KeyZ"===e.code&&(e.shiftKey?this.textInput.redo():this.textInput.undo(),e.preventDefault(),i=!0),i&&t()})),this.textInput.el.addEventListener("input",(()=>{t()}))}createEditor(){this.editor=document.createElement("div"),this.editor.classList.add("qmc-mermaid-editor");const t=document.createElement("div");return t.classList.add("qmc-mermaid-input"),this.textInput=new L(document.createElement("textarea"),this.histroyStackOptions),this.textInput.el.classList.add("qmc-mermaid-input-content"),this.textInput.el.value=this.mermaidBlot.text,this.bindInputEvent(),t.appendChild(this.textInput.el),this.preview=document.createElement("div"),this.preview.classList.add("qmc-mermaid-preview"),this.chart=document.createElement("div"),this.chart.classList.add("qmc-mermaid-preview-chart"),this.preview.appendChild(this.chart),this.editor.appendChild(t),this.editor.appendChild(this.preview),this.editor.style.height=`${Math.min(600,.5*window.innerHeight)}px`,this.editor}}class q{quill;mermaidBlot;#t=!1;options;scrollHandler=[];toolbox;selector;resizeOb;editor;histroyStackOptions;constructor(t,e,i,s){this.quill=t,this.mermaidBlot=e,this.options=this.resolveOptions(i),this.histroyStackOptions=s,this.toolbox=this.quill.addContainer("ql-toolbox"),this.createSelector()}resolveOptions(t){return Object.assign({onDestroy:()=>{},editorOptions:{}},t)}addContainer(t){if(!this.toolbox)return;const e=document.createElement("div");for(const i of t.split(" "))e.classList.add(i);return this.toolbox.appendChild(e),e}updateSelector(){if(!this.selector)return;const t=this.mermaidBlot.domNode.getBoundingClientRect(),{x:e,y:i}=function(t,e){const i=e.getBoundingClientRect();return{x:t.x-i.x-e.scrollLeft,y:t.y-i.y-e.scrollTop,x1:t.x-i.x-e.scrollLeft+t.width,y1:t.y-i.y-e.scrollTop+t.height,width:t.width,height:t.height}}(t,this.quill.root),{scrollTop:s,scrollLeft:o}=this.quill.root;Object.assign(this.selector.style,{left:`${e+o}px`,top:`${i+s}px`,width:`${t.width}px`,height:`${t.height}px`}),y.call(this),w.call(this,this.quill.root,(()=>{Object.assign(this.selector.style,{left:e+2*o-this.quill.root.scrollLeft+"px",top:i+2*s-this.quill.root.scrollTop+"px"})}))}createSelector(){if(this.selector=this.addContainer("ql-mermaid-select"),!this.selector)return;this.updateSelector(),this.resizeOb=new ResizeObserver((()=>{this.updateSelector()})),this.resizeOb.observe(this.mermaidBlot.domNode);const t=S({iconStr:'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-6v-4.25l9.175-9.175q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662L13.25 15zM21.025 4.4l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/></svg>',classList:["ql-mermaid-select-edit"],click:()=>{this.editor=new E(this.quill,this.mermaidBlot,{...this.options.editorOptions,onClose:()=>{this.editor=void 0,this.options.editorOptions.onClose&&this.options.editorOptions.onClose()}},this.histroyStackOptions)}}),e=S({iconStr:i,classList:["ql-mermaid-select-close"],click:()=>{this.mermaidBlot.remove(),this.#t=!0,this.destroy()}});this.quill.on(s,(t=>{this.selector&&this.selector.classList.add(t)})),this.selector.appendChild(e),this.selector.appendChild(t)}destroy(){this.quill.off(s),y.call(this),this.resizeOb&&this.resizeOb.disconnect(),this.toolbox&&(this.toolbox.remove(),this.toolbox=void 0),this.#t&&(this.#t=!1,this.options.onDestroy())}}function S(t){const{iconStr:e,classList:i,click:s}=t,o=document.createElement("span");o.classList.add("ql-mermaid-select-btn",...i);const n=document.createElement("i");return n.classList.add("ql-mermaid-icon"),n.innerHTML=e,o.appendChild(n),o.addEventListener("click",s),o}t.QuillMermaid=class{quill;static register(){e.import("ui/icons")[C.blotName]='<svg id="Layer_1" width="1em" height="1em" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490.16 490.16"><defs><mask id="Mask"><rect x="0" y="0" width="490.16" height="490.16" fill="white"></rect><path fill="black" d="M407.48,111.18A165.2,165.2,0,0,0,245.08,220,165.2,165.2,0,0,0,82.68,111.18a165.5,165.5,0,0,0,72.06,143.64,88.81,88.81,0,0,1,38.53,73.45v50.86H296.9V328.27a88.8,88.8,0,0,1,38.52-73.45,165.41,165.41,0,0,0,72.06-143.64Z"></path><path fill="black" d="M160.63,328.27a56.09,56.09,0,0,0-24.27-46.49,198.74,198.74,0,0,1-28.54-23.66A196.87,196.87,0,0,1,82.53,227V379.13h78.1Z"></path><path fill="black" d="M329.53,328.27a56.09,56.09,0,0,1,24.27-46.49,198.74,198.74,0,0,0,28.54-23.66A196.87,196.87,0,0,0,407.63,227V379.13h-78.1Z"></path></mask><style>.cls-1{fill:#76767B;}.cls-1:hover{fill:#FF3570}</style></defs><rect class="cls-1" width="490.16" height="490.16" rx="84.61" mask="url(#Mask)"></rect></svg>',e.register({[`formats/${C.blotName}`]:C},!0)}mermaidBlot;mermaidSelector;options;constructor(t,i){this.quill=t,this.options=this.resolveOptions(i);const s=this.quill.getModule("toolbar");s&&s.addHandler(C.blotName,(()=>{const t=this.quill.getSelection(!0);this.quill.insertEmbed(t.index,C.blotName,"")})),this.quill.root.addEventListener("click",(t=>{if(!this.quill.scroll.isEnabled())return;const i=t.composedPath();if(!i||i.length<=0)return;const s=i.find((t=>e.find(t)instanceof C));if(s){const t=e.find(s);if(this.mermaidBlot===t)return;this.updateMermaidSelector(t)}else this.destroyMermaidSelector()}),!1)}resolveOptions(t={}){return Object.assign({editor:{},histroyStackOptions:{}},t)}updateMermaidSelector(t){this.mermaidSelector&&this.destroyMermaidSelector(),t&&(this.mermaidBlot=t,this.mermaidSelector=new q(this.quill,this.mermaidBlot,{onDestroy:()=>this.destroyMermaidSelector(),editorOptions:this.options.editor},this.options.histroyStackOptions))}destroyMermaidSelector(){this.mermaidSelector&&(this.mermaidSelector.destroy(),this.mermaidBlot=void 0,this.mermaidSelector=void 0)}}}));
//# sourceMappingURL=dev.js.map
