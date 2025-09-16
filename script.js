/* ==========================
   Toast
========================== */
function toast(msg){
  const el=document.getElementById("toast");
  el.textContent=msg; el.classList.add("show");
  clearTimeout(toast._t);
  toast._t=setTimeout(()=>el.classList.remove("show"),2000);
}

/* ==========================
   Utils
========================== */
function formatLocalDate(d){
  const pad=n=>String(n).padStart(2,"0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function startOfWeek(d){ const x=new Date(d); const day=(x.getDay()+6)%7; x.setDate(x.getDate()-day); x.setHours(0,0,0,0); return x; } // Monday
function endOfWeek(d){ const s=startOfWeek(d); const e=new Date(s); e.setDate(e.getDate()+6); return e; }
function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1, 0); }
/* ==========================

   Users / Auth
========================== */
function getUsers(){return JSON.parse(localStorage.getItem("users")||"{}");}
function setUsers(u){localStorage.setItem("users",JSON.stringify(u));}
function currentKey(){return localStorage.getItem("currentUser");}

function doRegister(){
  const u=authUser.value.trim(), p=authPass.value, p2=authPass2.value;
  if(!u||!p) return toast("Fill all fields");
  if(p!==p2) return toast("Passwords do not match");
  const users=getUsers(); if(users[u]) return toast("User exists");
  users[u]={pass:p}; setUsers(users); toast("Register success");
}
function doLogin(){
  const u=authUser.value.trim(), p=authPass.value;
  const users=getUsers();
  if(u==="DayBuddy" && p==="Admin"){ enterAdmin(); return; }
  if(!users[u]||users[u].pass!==p) return toast("Invalid login");
  localStorage.setItem("currentUser",u); enterApp(u);
}
function logout(){
  localStorage.removeItem("currentUser");
  auth.style.display="block"; app.style.display="none"; admin.style.display="none";
}

/* ==========================
   Tasks
========================== */
let tasks=[], undoStack=[], redoStack=[];
function tKey(){return "tasks::"+currentKey();}
function loadTasks(){tasks=JSON.parse(localStorage.getItem(tKey())||"[]");}
function saveTasks(){localStorage.setItem(tKey(),JSON.stringify(tasks));}
function pushUndo(){undoStack.push(JSON.stringify(tasks)); if(undoStack.length>100) undoStack.shift();}

function addTask(){
  const title=inTitle.value.trim(); if(!title) return toast("Title required");
  const item={title,detail:inDetail.value,priority:inPriority.value,due:inDue.value,done:false};
  pushUndo(); redoStack=[];
  tasks.push(item); saveTasks(); renderTasks(); renderCalendar();
}
function addTaskAtIndex(){
  const title=inTitle.value.trim(); if(!title) return toast("Title required");
  let idx=Number(inIndex.value); if(Number.isNaN(idx)) idx=tasks.length;
  idx=Math.max(0, Math.min(idx, tasks.length));
  const item={title,detail:inDetail.value,priority:inPriority.value,due:inDue.value,done:false};
  pushUndo(); redoStack=[];
  tasks.splice(idx,0,item); saveTasks(); renderTasks(); renderCalendar();
}
function toggleDone(i){pushUndo(); redoStack=[]; tasks[i].done=!tasks[i].done; saveTasks(); renderTasks(); renderCalendar();}
function editTask(i){
  const t=tasks[i];
  const nt=prompt("Edit title",t.title); if(nt===null) return;
  const nd=prompt("Edit detail",t.detail??""); if(nd===null) return;
  pushUndo(); redoStack=[];
  tasks[i]={...t,title:nt,detail:nd}; saveTasks(); renderTasks(); renderCalendar();
}
function deleteTask(i){pushUndo(); redoStack=[]; tasks.splice(i,1); saveTasks(); renderTasks(); renderCalendar();}
function deleteAllTasks(){ if(!tasks.length) return; if(!confirm("Delete all tasks?")) return;
  pushUndo(); redoStack=[]; tasks=[]; saveTasks(); renderTasks(); renderCalendar();
}
function undoTask(){ if(!undoStack.length) return toast("Nothing to undo");
  redoStack.push(JSON.stringify(tasks)); tasks=JSON.parse(undoStack.pop()); saveTasks(); renderTasks(); renderCalendar();
}
function redoTask(){ if(!redoStack.length) return toast("Nothing to redo");
  undoStack.push(JSON.stringify(tasks)); tasks=JSON.parse(redoStack.pop()); saveTasks(); renderTasks(); renderCalendar();
}
function renderTasks(list=tasks){
  const q=inSearch.value.trim().toLowerCase();
  tbody.innerHTML="";
  list.filter(t=>!q || t.title.toLowerCase().includes(q) || (t.detail||"").toLowerCase().includes(q))
      .forEach((t,i)=>{
        const tr=document.createElement("tr");
        if(t.done) tr.className="done";
        tr.innerHTML=`
          <td>${i}</td>
          <td>${t.title}</td>
          <td>${t.detail||""}</td>
          <td>${t.priority}</td>
          <td>${t.due||"-"}</td>
          <td><input type="checkbox" ${t.done?"checked":""} onclick="toggleDone(${i})"></td>
          <td>
            <button onclick="editTask(${i})">Edit</button>
            <button onclick="deleteTask(${i})">Delete</button>
          </td>`;
        tbody.appendChild(tr);
      });
}

/* ==========================
   Calendar
========================== */
let calYear, calMonth;
function initCalendar(){const d=new Date(); calYear=d.getFullYear(); calMonth=d.getMonth();}
function goToday(){ const d=new Date(); calYear=d.getFullYear(); calMonth=d.getMonth(); renderCalendar(); }
function prevMonth(){ calMonth--; if(calMonth<0){calMonth=11; calYear--;} renderCalendar(); }
function nextMonth(){ calMonth++; if(calMonth>11){calMonth=0; calYear++;} renderCalendar(); }

function renderCalendar(){
  const grid=calendarGrid, title=monthTitle;
  const first=new Date(calYear,calMonth,1), last=new Date(calYear,calMonth+1,0);
  const days=last.getDate(), start=first.getDay();
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  title.textContent=`${months[calMonth]} ${calYear}`;
  grid.innerHTML="";

  // weekday header
  ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(d=>{
    const hd=document.createElement("div"); hd.className="cal-head"; hd.textContent=d; grid.appendChild(hd);
  });

  // empty slots before day 1
  for(let i=0;i<start;i++){ grid.appendChild(document.createElement("div")); }

  const todayStr=formatLocalDate(new Date());

  for(let d=1; d<=days; d++){
    const cell=document.createElement("div"); cell.className="day-cell";
    const iso=formatLocalDate(new Date(calYear, calMonth, d));
    const count=tasks.filter(t=>t.due===iso).length;
    const dn=document.createElement("div"); dn.className="day-num"; dn.textContent=d;
    const cnt=document.createElement("div"); cnt.className="count"; cnt.textContent=`${count} task(s)`;
    cell.appendChild(dn); cell.appendChild(cnt);
    if(iso===todayStr) cell.classList.add("today");

    cell.onclick=()=>{
      const filtered=tasks.filter(t=>t.due===iso);
      renderTasks(filtered);
      toast(`Showing tasks for ${iso}`);
    };

    grid.appendChild(cell);
  }
}

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

/* ==========================
   Reminder
========================== */
let reminderTimer=null;
function setReminder(){
  clearTimeout(reminderTimer);
  const val=Number(remValue.value), unit=remUnit.value;
  if(!val || val<=0) return toast("Enter a positive time");
  let ms=val*1000; if(unit==="min") ms=val*60000; if(unit==="hour") ms=val*3600000;
  reminderTimer=setTimeout(()=> ringAlarm(), ms);
  toast(`Reminder set for ${val} ${unit}`);
}
function ringAlarm(){
  ringBadge.style.display="inline-block";
  const sound=document.getElementById("alarmSound");
  sound.loop=true; sound.currentTime=0; sound.play();
}
function stopReminder(){
  clearTimeout(reminderTimer);
  const sound=document.getElementById("alarmSound");
  sound.pause(); sound.currentTime=0;
  ringBadge.style.display="none";
}
function snoozeReminder(){
  stopReminder();
  reminderTimer=setTimeout(()=> ringAlarm(), 5*60000);
  toast("Snoozed for 5 minutes");
}

/* ==========================
   Admin
========================== */
let adminUndoStack=[], adminRedoStack=[];
function enterAdmin(){auth.style.display="none"; app.style.display="none"; admin.style.display="block"; renderAdminUsers();}
function renderAdminUsers(){
  const users=getUsers(); adminUsers.innerHTML="";
  Object.keys(users).forEach(u=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${u}</td>
      <td>
        <button onclick="adminView('${u}')">View</button>
        <button onclick="adminDelete('${u}')">Delete</button>
      </td>`;
    adminUsers.appendChild(tr);
  });
}
function adminView(username){
  const t=JSON.parse(localStorage.getItem("tasks::"+username)||"[]");
  const e=JSON.parse(localStorage.getItem("exp::"+username)||"[]");
  let html=`<h3>Data of ${username}</h3>`;
  html+=`<h4>Tasks</h4><ul>`+t.map(x=>`<li>${x.title} - ${x.done?"Done":"Pending"} (${x.due||"-"})</li>`).join("")+`</ul>`;
  html+=`<h4>Expenses</h4><ul>`+e.map(x=>`<li>${x.date} - ${x.type} - ${x.title} (${x.amt})</li>`).join("")+`</ul>`;
  adminViewBox.innerHTML=html;
}
function adminDelete(username){
  const users=getUsers(); if(!users[username]) return;
  if(!confirm("Delete user "+username+" ?")) return;
  adminUndoStack.push({
    user: username,
    data: users[username],
    tasks: localStorage.getItem("tasks::"+username),
    expenses: localStorage.getItem("exp::"+username)
  });
  if(adminUndoStack.length>100) adminUndoStack.shift();
  delete users[username]; setUsers(users);
  localStorage.removeItem("tasks::"+username);
  localStorage.removeItem("exp::"+username);
  toast("User deleted"); renderAdminUsers();
}
function adminUndo(){
  if(!adminUndoStack.length) return toast("Nothing to undo");
  const last=adminUndoStack.pop(); const users=getUsers();
  users[last.user]=last.data; setUsers(users);
  if(last.tasks) localStorage.setItem("tasks::"+last.user,last.tasks);
  if(last.expenses) localStorage.setItem("exp::"+last.user,last.expenses);
  adminRedoStack.push(last); renderAdminUsers(); toast("Undo complete");
}
function adminRedo(){
  if(!adminRedoStack.length) return toast("Nothing to redo");
  const last=adminRedoStack.pop(); const users=getUsers();
  delete users[last.user]; setUsers(users);
  localStorage.removeItem("tasks::"+last.user);
  localStorage.removeItem("exp::"+last.user);
  adminUndoStack.push(last); renderAdminUsers(); toast("Redo complete");
}

/* ==========================
   Enter App
========================== */
function enterApp(u){
  welcome.textContent="Welcome, "+u;
  auth.style.display="none"; app.style.display="block"; admin.style.display="none";
  loadTasks(); renderTasks(); initCalendar(); renderCalendar();
  loadExpenses(); renderExpenses();
  sumDate.value = formatLocalDate(new Date()); // default summary anchor
  updateSummaryBox.scope="day"; updateSummaryBox();
}

/* Auto-login */
const last=currentKey(); if(last){ if(last==="DayBuddy") enterAdmin(); else enterApp(last); }