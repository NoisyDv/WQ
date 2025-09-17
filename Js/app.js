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
const last=currentKey(); 
if(last){
     if(last==="DayBuddy") enterAdmin(); else enterApp(last); 
}
