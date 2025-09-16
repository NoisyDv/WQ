
/* ===== TOAST ===== */
function toast(msg){
  const el=document.getElementById("toast");
  el.textContent=msg;el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),2000);
}

/* ===== HELPER ===== */
function formatLocalDate(d){
  const pad=n=>String(n).padStart(2,"0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

/* ===== USERS ===== */
function getUsers(){return JSON.parse(localStorage.getItem("users")||"{}");}
function setUsers(u){localStorage.setItem("users",JSON.stringify(u));}
function currentKey(){return localStorage.getItem("currentUser");}

/* ===== AUTH ===== */
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

/* ===== TASKS ===== */
let tasks=[], undoStack=[], redoStack=[];
function loadTasks(){tasks=JSON.parse(localStorage.getItem("tasks::"+currentKey())||"[]");}
function saveTasks(){localStorage.setItem("tasks::"+currentKey(),JSON.stringify(tasks));}
// Save current state for undo before adding a new task
function addTask(){
  undoStack.push(JSON.stringify(tasks)); // <-- Save for undo
  redoStack = []; // Clear redo stack on new action
  const t=inTitle.value.trim(); if(!t) return toast("No title");
  const d=inDetail.value, p=inPriority.value, due=inDue.value;
  tasks.push({title:t,detail:d,priority:p,due,done:false});
  saveTasks(); renderTasks(); renderCalendar();
}
// Save current state for undo before toggling done

function toggleDone(i){
  undoStack.push(JSON.stringify(tasks)); // <-- Save for undo
  redoStack = []; // Clear redo stack on new action
  tasks[i].done=!tasks[i].done;
  saveTasks();renderTasks();renderCalendar();
}
// Save current state for undo before deleting a task
function deleteTask(i){
  undoStack.push(JSON.stringify(tasks)); // <-- Save for undo
  redoStack = []; // Clear redo stack on new action
  tasks.splice(i,1);
  saveTasks();renderTasks();renderCalendar();
}
// Save current state for undo before deleting all tasks
function deleteAllTasks(){
  if(confirm("Delete all tasks?")){
    undoStack.push(JSON.stringify(tasks)); // <-- Save for undo
    redoStack = []; // Clear redo stack on new action
    tasks=[];
    saveTasks();renderTasks();renderCalendar();
  }
}
function undoTask(){if(!undoStack.length) return toast("Nothing to undo");redoStack.push(JSON.stringify(tasks));tasks=JSON.parse(undoStack.pop());saveTasks();renderTasks();renderCalendar();}
function redoTask(){if(!redoStack.length) return toast("Nothing to redo");undoStack.push(JSON.stringify(tasks));tasks=JSON.parse(redoStack.pop());saveTasks();renderTasks();renderCalendar();}
function renderTasks(){
  const q=inSearch.value.toLowerCase(); tbody.innerHTML="";
  tasks.filter(t=>!q||t.title.toLowerCase().includes(q)||t.detail.toLowerCase().includes(q))
       .forEach((t,i)=>{const tr=document.createElement("tr");if(t.done)tr.className="done";
         tr.innerHTML=`<td>${i}</td><td>${t.title}</td><td>${t.detail}</td>
                       <td>${t.priority}</td><td>${t.due||"-"}</td>
                       <td><input type=checkbox ${t.done?"checked":""} onclick="toggleDone(${i})"></td>
                       <td><button onclick="deleteTask(${i})">Delete</button></td>`;tbody.appendChild(tr);});
}

/* ===== CALENDAR ===== */
let calYear, calMonth;
function initCalendar(){const d=new Date();calYear=d.getFullYear();calMonth=d.getMonth();}
function renderCalendar(){
  const grid=calendarGrid,title=monthTitle;
  const first=new Date(calYear,calMonth,1),last=new Date(calYear,calMonth+1,0);
  const days=last.getDate(),start=first.getDay();
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  title.textContent=`${months[calMonth]} ${calYear}`; grid.innerHTML="";

  for(let i=0;i<start;i++)grid.appendChild(document.createElement("div"));
  for(let d=1;d<=days;d++){
    const cell=document.createElement("div");
    cell.style.border="1px solid var(--border)";
    cell.style.borderRadius="6px";
    cell.style.padding="6px";
    cell.style.cursor="pointer";
    const iso=formatLocalDate(new Date(calYear,calMonth,d));
    const cnt=tasks.filter(t=>t.due===iso).length;
    cell.innerHTML=`<div>${d}</div><div style="font-size:12px;color:var(--muted)">${cnt} task(s)</div>`;
    cell.onclick=()=>{
      inSearch.value="";
      const filtered=tasks.filter(t=>t.due===iso);
      tbody.innerHTML="";
      filtered.forEach((t,i)=>{
        const tr=document.createElement("tr");
        if(t.done) tr.className="done";
        tr.innerHTML=`<td>${i}</td><td>${t.title}</td><td>${t.detail}</td>
                      <td>${t.priority}</td><td>${t.due||"-"}</td>
                      <td><input type=checkbox ${t.done?"checked":""} onclick="toggleDone(${i})"></td>
                      <td><button onclick="deleteTask(${i})">Delete</button></td>`;
        tbody.appendChild(tr);
      });
      toast("Showing tasks for "+iso);
    };
    grid.appendChild(cell);
  }
}
function prevMonth(){calMonth--;if(calMonth<0){calMonth=11;calYear--;}renderCalendar();}
function nextMonth(){calMonth++;if(calMonth>11){calMonth=0;calYear++;}renderCalendar();}

/* ===== EXPENSES ===== */
let expenses=[];
function loadExpenses(){expenses=JSON.parse(localStorage.getItem("exp::"+currentKey())||"[]");}
function saveExpenses(){localStorage.setItem("exp::"+currentKey(),JSON.stringify(expenses));}
function addExpense(){
  const date=exDate.value, type=exType.value, title=exTitle.value, amt=Number(exAmount.value);
  if(!date||!title||!amt) return toast("Fill all expense fields");
  expenses.push({date,type,title,amt}); saveExpenses(); renderExpenses();
}
function editExpense(i){
  const e=expenses[i];
  const nt=prompt("Edit title",e.title)||e.title;
  const na=Number(prompt("Edit amount",e.amt))||e.amt;
  expenses[i]={...e,title:nt,amt:na}; saveExpenses(); renderExpenses();
}
function deleteExpense(i){expenses.splice(i,1);saveExpenses();renderExpenses();}
function deleteAllExpenses(){if(confirm("Delete all expenses?")){expenses=[];saveExpenses();renderExpenses();}}
function renderExpenses(){
  const q=exSearch.value.toLowerCase(); exTbody.innerHTML="";
  let inc=0,exp=0;
  expenses.filter(e=>!q||e.title.toLowerCase().includes(q))
          .forEach((e,i)=>{const tr=document.createElement("tr");
            if(e.type==="income")inc+=e.amt; else exp+=e.amt;
            tr.innerHTML=`<td>${i}</td><td>${e.date}</td><td>${e.type}</td><td>${e.title}</td><td>${e.amt.toFixed(2)}</td>
                          <td><button onclick="editExpense(${i})">Edit</button>
                              <button onclick="deleteExpense(${i})">Delete</button></td>`;
            exTbody.appendChild(tr);});
  const profit=inc-exp;
  exSummary.textContent=`Income: ${inc.toFixed(2)} | Expense: ${exp.toFixed(2)} | Profit: ${profit.toFixed(2)}`;
}
exSearch.oninput=renderExpenses;

/* ===== REMINDER ===== */
let reminderTimer=null;
function setReminder(){
  clearTimeout(reminderTimer);
  const val=Number(remValue.value),unit=remUnit.value;
  let ms=val*1000; if(unit==="min")ms=val*60000; if(unit==="hour")ms=val*3600000;
  reminderTimer=setTimeout(()=>{ ringAlarm(); },ms);
  toast("Reminder set for "+val+" "+unit);
}
function ringAlarm(){
  document.getElementById("ringBadge").style.display="inline-block";
  const sound=document.getElementById("alarmSound");
  sound.loop=true; sound.play();
}
function stopReminder(){
  clearTimeout(reminderTimer);
  const sound=document.getElementById("alarmSound");
  sound.pause(); sound.currentTime=0;
  document.getElementById("ringBadge").style.display="none";
}
function snoozeReminder(){
  stopReminder();
  reminderTimer=setTimeout(()=>{ ringAlarm(); },5*60000);
  toast("Snoozed for 5 minutes");
}

/* ============================================= ADMIN ZONE=============================================== */
let adminUndoStack=[], adminRedoStack=[];
function enterAdmin(){auth.style.display="none";app.style.display="none";admin.style.display="block";renderAdminUsers();}
function renderAdminUsers(){
  const users=getUsers(); adminUsers.innerHTML="";
  Object.keys(users).forEach(u=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${u}</td>
      <td><button onclick="adminView('${u}')">View</button>
          <button onclick="adminDelete('${u}')">Delete</button></td>`;
    adminUsers.appendChild(tr);
  });
}
function adminView(username){
  const tasks=JSON.parse(localStorage.getItem("tasks::"+username)||"[]");
  const exp=JSON.parse(localStorage.getItem("exp::"+username)||"[]");
  let html=`<h3>Data of ${username}</h3>`;
  html+=`<h4>Tasks</h4><ul>`+tasks.map(t=>`<li>${t.title} - ${t.done?"Done":"Pending"}</li>`).join("")+`</ul>`;
  html+=`<h4>Expenses</h4><ul>`+exp.map(e=>`<li>${e.date} - ${e.type} - ${e.title} (${e.amt})</li>`).join("")+`</ul>`;
  document.getElementById("adminViewBox").innerHTML=html;
}
function adminDelete(username){
  const users=getUsers();
  if(!users[username]) return;
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
  const last=adminUndoStack.pop();
  const users=getUsers();
  users[last.user]=last.data;
  setUsers(users);
  if(last.tasks) localStorage.setItem("tasks::"+last.user,last.tasks);
  if(last.expenses) localStorage.setItem("exp::"+last.user,last.expenses);
  adminRedoStack.push(last);
  renderAdminUsers(); toast("Undo complete");
}
function adminRedo(){
  if(!adminRedoStack.length) return toast("Nothing to redo");
  const last=adminRedoStack.pop();
  const users=getUsers();
  delete users[last.user]; setUsers(users);
  localStorage.removeItem("tasks::"+last.user);
  localStorage.removeItem("exp::"+last.user);
  adminUndoStack.push(last);
  renderAdminUsers(); toast("Redo complete");
}

/* ===== ENTER APP ===== */
function enterApp(u){
  welcome.textContent="Welcome, "+u;
  auth.style.display="none"; app.style.display="block"; admin.style.display="none";
  loadTasks();renderTasks(); loadExpenses();renderExpenses(); initCalendar();renderCalendar();
}

/* Auto-login */
const last=currentKey(); if(last){if(last==="DayBuddy") enterAdmin(); else enterApp(last);}

// Enable live search for Task Manager
if (typeof inSearch !== 'undefined') {
  inSearch.oninput = renderTasks;
}