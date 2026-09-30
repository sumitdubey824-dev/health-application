
document.addEventListener("DOMContentLoaded", () => {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });

  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if(toggle && links) toggle.addEventListener("click",()=>links.classList.toggle("open"));

  // Daily Health Score
  const scoreBtn = document.getElementById("scoreBtn");
  if(scoreBtn){
    scoreBtn.addEventListener("click",()=>{
      const steps = Math.max(0, Number(document.getElementById("steps").value)||0);
      const water = Math.max(0, Number(document.getElementById("water").value)||0);
      const exercise = Math.max(0, Number(document.getElementById("exercise").value)||0);
      const sleep = Math.max(0, Number(document.getElementById("sleep").value)||0);
      const score = Math.round(
        Math.min(30,steps/300)*1 +
        Math.min(25,water/8*25) +
        Math.min(25,exercise/30*25) +
        Math.min(20,sleep/8*20)
      );
      const box=document.getElementById("scoreOutput");
      let msg = score>=80 ? "Great! Your daily habits look well balanced." :
                score>=60 ? "Good progress. A few healthy habits can be improved." :
                "Use this as a gentle reminder to focus on movement, hydration and rest.";
      box.style.display="block";
      box.innerHTML=`<strong>${score}/100</strong><p>${msg}</p><small>Educational demonstration only — not a medical assessment.</small>`;
    });
  }

  // Medicine reminders
  const reminderForm=document.getElementById("reminderForm");
  const reminderList=document.getElementById("reminderList");
  function getReminders(){return JSON.parse(localStorage.getItem("cepMedicineReminders")||"[]")}
  function renderReminders(){
    if(!reminderList)return;
    const data=getReminders();
    reminderList.innerHTML=data.length ? data.map((r,i)=>`<div class="reminder"><span><strong>${escapeHtml(r.name)}</strong><br><small>${escapeHtml(r.time)}</small></span><button class="small-btn" onclick="deleteReminder(${i})">Delete</button></div>`).join("") : "<p class='lead'>No reminders saved yet.</p>";
  }
  window.deleteReminder=function(i){const d=getReminders();d.splice(i,1);localStorage.setItem("cepMedicineReminders",JSON.stringify(d));renderReminders()};
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
  if(reminderForm){
    reminderForm.addEventListener("submit",e=>{
      e.preventDefault();
      const name=document.getElementById("medicineName").value.trim(), time=document.getElementById("medicineTime").value;
      if(!name||!time)return;
      const d=getReminders();d.push({name,time});localStorage.setItem("cepMedicineReminders",JSON.stringify(d));
      reminderForm.reset();renderReminders();
    });renderReminders();
  }

  // Survey
  const surveyForm=document.getElementById("surveyForm");
  if(surveyForm){
    surveyForm.addEventListener("submit",e=>{
      e.preventDefault();
      if(!surveyForm.checkValidity()){surveyForm.reportValidity();return}
      const fd=new FormData(surveyForm);
      const obj={submittedAt:new Date().toISOString()};
      for(const [k,v] of fd.entries()){
        if(obj[k]) obj[k]=Array.isArray(obj[k])?[...obj[k],v]:[obj[k],v]; else obj[k]=v;
      }
      const old=JSON.parse(localStorage.getItem("cepSurveyResponses")||"[]");old.push(obj);
      localStorage.setItem("cepSurveyResponses",JSON.stringify(old));
      document.getElementById("surveySuccess").style.display="block";
      surveyForm.reset();
      window.scrollTo({top:document.getElementById("surveySuccess").offsetTop-100,behavior:"smooth"});
    });
  }
});
