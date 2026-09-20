const nav=document.getElementById("nav"),toggle=document.getElementById("menuToggle");
toggle?.addEventListener("click",()=>nav?.classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>nav?.classList.remove("open")));

const glow=document.querySelector(".cursor-glow");
document.addEventListener("pointermove",e=>{
 if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";}
 const el=e.target.closest(".gold-hover");
 if(el){const r=el.getBoundingClientRect();el.style.setProperty("--mx",((e.clientX-r.left)/r.width*100)+"%");el.style.setProperty("--my",((e.clientY-r.top)/r.height*100)+"%");}
});

// Free Google Sheets automation
const SCRIPT_URL="https://script.google.com/macros/s/AKfycbwsQwdz23OX5RbKx_DwCBjoiDOaSCFAoRUUbsojjL1U17nuNw-mPy63AA9YbMgCg9wn/exec";

async function sendToGoogleSheets(payload){
 await fetch(SCRIPT_URL,{
  method:"POST",
  mode:"no-cors",
  headers:{"Content-Type":"text/plain;charset=utf-8"},
  body:JSON.stringify(payload)
 });
}

const form=document.getElementById("reservationForm"),note=document.getElementById("formNote");
form?.addEventListener("submit",async e=>{
 e.preventDefault();
 const inputs=form.querySelectorAll("input,select,textarea");
 const name=inputs[0]?.value||"";
 const email=inputs[1]?.value||"";
 const date=inputs[2]?.value||"";
 const guests=inputs[3]?.value||"";
 const time=inputs[4]?.value||"";
 const requests=inputs[5]?.value||"";
 const button=form.querySelector("button[type=submit]");
 const original=button?.innerHTML;
 if(button){button.disabled=true;button.innerHTML="Sending...";}
 try{
  await sendToGoogleSheets({
   name,
   email,
   company:"VELORA",
   projectType:"Restaurant Reservation",
   budget:"",
   timeline:`${date} at ${time}`,
   details:`Guests: ${guests}\nSpecial requests: ${requests}`
  });
  if(note)note.textContent="Reservation request received — our team will contact you shortly.";
  form.reset();
 }catch(err){
  if(note)note.textContent="Could not send automatically. Please try again.";
  console.error(err);
 }finally{
  if(button){button.disabled=false;button.innerHTML=original;}
 }
});
