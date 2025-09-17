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