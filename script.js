const display = document.getElementById('display');
let expr = '';

function update(){
  display.textContent = expr === '' ? '0' : expr;
}

function safeEval(s){
  try{
    s = s.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
    s = s.replace(/(\d+(\.\d+)?)%/g,'($1/100)');
    s = s.replace(/\^/g,'**');

    const allowed = ['sin','cos','tan','sqrt','log','abs','pow','exp','PI','E','pi'];
    const ids = Array.from(new Set((s.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [])));
    for(const id of ids){
      if(!allowed.includes(id)){
        return 'Error';
      }
    }

    s = s.replace(/\bPI\b/g,'Math.PI')
         .replace(/\bpi\b/g,'Math.PI')
         .replace(/\bE\b/g,'Math.E');

    const result = Function('with (Math) { return (' + s + ')}')();
    if(!isFinite(result)) return 'Error';
    return Math.round((result + Number.EPSILON) * 100000000) / 100000000;
  }catch(e){
    return 'Error';
  }
}

document.addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;

  const val = btn.getAttribute('data-value');
  const action = btn.getAttribute('data-action');

  if(action === 'clear'){ expr = ''; update(); return; }
  if(action === 'back'){ expr = expr.slice(0,-1); update(); return; }
  if(action === 'equals'){ expr = String(safeEval(expr)); update(); return; }

  if(val){
    expr += val;
    update();
  }
});

document.addEventListener('keydown', e=>{
  const k = e.key;

  if(k >= '0' && k <= '9'){ expr += k; update(); return; }
  if(k === '.') { expr += '.'; update(); return; }
  if(['+','-','*','/','(',')',','].includes(k)){ expr += k; update(); return; }
  if(k === '^'){ expr += '^'; update(); return; }
  if(k === '%'){ expr += '%'; update(); return; }

  if(k === 'Enter' || k === '='){ expr = String(safeEval(expr)); update(); return; }
  if(k === 'Backspace'){ expr = expr.slice(0,-1); update(); return; }
  if(k === 'Escape'){ expr = ''; update(); return; }
});
