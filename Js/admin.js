
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
  localStorage.removeItem("exp::"+username)
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