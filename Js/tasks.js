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