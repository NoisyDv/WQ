import { toast } from "./toast.js";
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