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