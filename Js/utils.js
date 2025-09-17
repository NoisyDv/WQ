/* ==========================
   Utils
========================== */
function formatLocalDate(d){
  const pad=n=>String(n).padStart(2,"0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function startOfWeek(d){
    const x=new Date(d);
    const day=(x.getDay()+6)%7;
    x.setDate(x.getDate()-day);
    x.setHours(0,0,0,0); return x;
} 

function endOfWeek(d){
    const s=startOfWeek(d);
    const e=new Date(s);
    e.setDate(e.getDate()+6); 
    return e; 
}
function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1, 0); }
