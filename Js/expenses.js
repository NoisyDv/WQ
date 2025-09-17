/* ==========================
   Expenses
========================== */
let expenses=[], expUndoStack=[], expRedoStack=[];
function eKey(){return "exp::"+currentKey();}
function loadExpenses(){expenses=JSON.parse(localStorage.getItem(eKey())||"[]");}
function saveExpenses(){localStorage.setItem(eKey(), JSON.stringify(expenses));}
function expPushUndo(){expUndoStack.push(JSON.stringify(expenses)); if(expUndoStack.length>100) expUndoStack.shift();}

function addExpense(){
  const date=exDate.value, type=exType.value, title=exTitle.value.trim(), amt=Number(exAmount.value);
  if(!date||!title||!amt) return toast("Fill all expense fields");
  expPushUndo(); expRedoStack=[];
  expenses.push({date,type,title,amt}); saveExpenses(); renderExpenses();
}
function editExpense(i){
  const e=expenses[i]; if(!e) return;
  const nt=prompt("Edit title", e.title); if(nt===null) return;
  const na=prompt("Edit amount", e.amt); if(na===null) return;
  const nAmt=Number(na); if(Number.isNaN(nAmt)) return toast("Amount invalid");
  expPushUndo(); expRedoStack=[];
  expenses[i]={...e,title:nt,amt:nAmt}; saveExpenses(); renderExpenses();
}
function deleteExpense(i){expPushUndo(); expRedoStack=[]; expenses.splice(i,1); saveExpenses(); renderExpenses();}
function deleteAllExpenses(){ if(!expenses.length) return; if(!confirm("Delete all expenses?")) return;
  expPushUndo(); expRedoStack=[]; expenses=[]; saveExpenses(); renderExpenses();
}
function expUndo(){ if(!expUndoStack.length) return toast("Nothing to undo"); expRedoStack.push(JSON.stringify(expenses)); expenses=JSON.parse(expUndoStack.pop()); saveExpenses(); renderExpenses(); }
function expRedo(){ if(!expRedoStack.length) return toast("Nothing to redo"); expUndoStack.push(JSON.stringify(expenses)); expenses=JSON.parse(expRedoStack.pop()); saveExpenses(); renderExpenses(); }

function renderExpenses(){
  const q=exSearch.value.trim().toLowerCase(); exTbody.innerHTML="";
  let inc=0, exp=0;
  expenses.filter(e=>!q || e.title.toLowerCase().includes(q) || e.type.toLowerCase().includes(q))
    .forEach((e,i)=>{
      if(e.type==="income") inc+=e.amt; else exp+=e.amt;
      const tr=document.createElement("tr");
      tr.innerHTML=`
        <td>${i}</td><td>${e.date}</td><td>${e.type}</td>
        <td>${e.title}</td><td>${e.amt.toFixed(2)}</td>
        <td>
          <button onclick="editExpense(${i})">Edit</button>
          <button onclick="deleteExpense(${i})">Delete</button>
        </td>`;
      exTbody.appendChild(tr);
    });
  const profit=inc-exp;
  exSummary.textContent=`Income: ${inc.toFixed(2)} | Expense: ${exp.toFixed(2)} | Profit: ${profit.toFixed(2)}`;
  // update summary box if a date is selected
  if(sumDate.value){ updateSummaryBox(); }
}
/* ---- Expense Summaries ---- */
function listInRange(fromISO,toISO){
  const from=new Date(fromISO+"T00:00:00");
  const to=new Date(toISO+"T23:59:59");
  return expenses.filter(e=>{
    const x=new Date(e.date+"T12:00:00"); // avoid timezone drift
    return x>=from && x<=to;
  });
}
function updateSummaryBox(){
  const anchor = sumDate.value ? new Date(sumDate.value+"T12:00:00") : new Date();
  const scope = updateSummaryBox.scope || "day"; // day | week | month
  let title="", from, to;

  if(scope==="day"){
    from=to=formatLocalDate(anchor);
    title=`Summary of ${from}`;
  }else if(scope==="week"){
    const s=startOfWeek(anchor), e=endOfWeek(anchor);
    from=formatLocalDate(s); to=formatLocalDate(e);
    title=`Summary of week ${from} ? ${to}`;
  }else{
    const s=startOfMonth(anchor), e=endOfMonth(anchor);
    from=formatLocalDate(s); to=formatLocalDate(e);
    title=`Summary of ${anchor.toLocaleString('default',{month:'short'})} ${anchor.getFullYear()}`;
  }

  const list=listInRange(from,to);
  let inc=0,exp=0;
  const rows=list.map((e,i)=>{
    if(e.type==="income") inc+=e.amt; else exp+=e.amt;
    return `<tr><td>${i+1}</td><td>${e.date}</td><td>${e.type}</td><td>${e.title}</td><td style="text-align:right">${e.amt.toFixed(2)}</td></tr>`;
  }).join("");
  const profit=inc-exp;

  summaryBox.innerHTML = `
    <div class="row" style="align-items:center;justify-content:space-between;margin-bottom:6px">
      <div><b>${title}</b></div>
      <div class="muted">Items: ${list.length}</div>
    </div>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr><th>#</th><th>Date</th><th>Type</th><th>Title</th><th style="text-align:right">Amount</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="5" class="muted">No entries</td></tr>`}</tbody>
    </table>
    <div style="margin-top:8px;font-weight:700">
      Income: ${inc.toFixed(2)} | Expense: ${exp.toFixed(2)} | Profit: ${profit.toFixed(2)}
    </div>
  `;
}
function showDaySummary(){ updateSummaryBox.scope="day"; updateSummaryBox(); }
function showWeekSummary(){ updateSummaryBox.scope="week"; updateSummaryBox(); }
function showMonthSummary(){ updateSummaryBox.scope="month"; updateSummaryBox(); }
sumDate.onchange = updateSummaryBox;
