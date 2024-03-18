document.addEventListener("DOMContentLoaded", function(event) {
    const text = document.getElementById('animatedText').textContent;
    const textLength = text.length;
    const delay = 80; 
    let i = 0;
  
    function animateText() {
      document.getElementById('animatedText').textContent = text.slice(0, i);
      i++;
      if (i <= textLength) {
        setTimeout(animateText, delay);
      }
    }
  
    animateText();
  });

let btns=document.querySelectorAll('button');

for (let btn of btns) {
    shadowStyle=btn.style.boxShadow;
    btn.addEventListener('mouseenter', ()=>{
        btn.style.boxShadow = '4px 4px 4px 0px #9DC1E9';
    })
    btn.addEventListener('mouseleave', ()=>{
        btn.style.boxShadow = shadowStyle;
    })
}