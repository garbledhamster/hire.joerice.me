/* ======================================================
   Guided-tour logic  ·  hire.joerice.me/demos/tour.js
   Tips now always appear dead-centre in the viewport
   ====================================================== */

/* — step definitions (parent selectors still used only
     for the orange outline) — */
     const steps = [
        { tip: 'tipHero',     focus: '#heroHead'     },
        { tip: 'tipServices', focus: '#services'     },
        { tip: 'tipAbout',    focus: '#about'        },
        { tip: 'tipStats',    focus: '#stats'        },
        { tip: 'tipContact',  focus: '#contact'      }
      ];
      
      /* — DOM references — */
      const bar      = document.getElementById('tourBar');
      const startBtn = document.getElementById('startTour');
      const dots     = [...document.querySelectorAll('#stepNav button')];
      const guides   = steps.map(s => document.getElementById(s.tip));
      
      let hlBox, hideTipTimer, clearAllTimer, currentStep = null;
      
      /* ---------- draw / move orange outline ------------------------------ */
      function frame(el){
        const r = el.getBoundingClientRect();
        if(!hlBox){
          hlBox = Object.assign(document.createElement('div'), { id:'hlBox' });
          hlBox.style.cssText =
            'position:absolute;border:3px solid #ffa500;border-radius:8px;' +
            'pointer-events:none;z-index:1200;transition:.25s';
          document.body.appendChild(hlBox);
        }
        hlBox.style.top    = `${r.top  + scrollY - 8}px`;
        hlBox.style.left   = `${r.left - 8}px`;
        hlBox.style.width  = `${r.width  + 16}px`;
        hlBox.style.height = `${r.height + 16}px`;
      }
      
      /* ---------- clear everything ---------------------------------------- */
      function clearAll(){
        document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        hlBox?.remove(); hlBox = null;
      
        guides.forEach(g => {
          g.style.display = 'none';
          g.classList.remove('show');
          g.onclick = null;
        });
      
        clearTimeout(hideTipTimer);
        clearTimeout(clearAllTimer);
        currentStep = null;
      }
      
      /* ---------- wait for scroll to settle ------------------------------- */
      function afterScroll(callback){
        /* 2 idle animation frames = scroll finished */
        let lastY = scrollY, idle = 0;
        function check(){
          if(scrollY !== lastY){ lastY = scrollY; idle = 0; requestAnimationFrame(check); }
          else if(++idle < 2){ requestAnimationFrame(check); }
          else callback();
        }
        requestAnimationFrame(check);
      }
      
      /* ---------- main step engine ---------------------------------------- */
      function showStep(i){
        clearAll(); currentStep = i;
      
        /* step dots */
        dots.forEach(d => d.classList.remove('active'));
        dots[i].classList.add('active');
      
        const focusEl = document.querySelector(steps[i].focus);
        if(!focusEl) return;
      
        /* scroll target into centre of viewport */
        focusEl.scrollIntoView({ behavior:'smooth', block:'center' });
      
        /* run when scrolling is done so outline is correct */
        afterScroll(() => {
          focusEl.classList.add('highlight');
          frame(focusEl);
      
          const tip = guides[i];
          tip.style.display = 'block';                 // allow fade-in
          tip.style.top  = '50%';                      // —— centre of viewport
          tip.style.left = '50%';
          tip.style.transform = 'translate(-50%,-50%)';
          requestAnimationFrame(() => tip.classList.add('show'));
      
          /* tap / click the tip → dismiss immediately */
          tip.onclick = clearAll;
      
          hideTipTimer  = setTimeout(() => tip.classList.remove('show'), 3000);
          clearAllTimer = setTimeout(clearAll, 6000);
        });
      }
      
      /* ---------- controls ------------------------------------------------- */
      startBtn.onclick = () => {
        bar.classList.add('animating');
        setTimeout(() => bar.classList.add('on'), 400);
        scrollBy({ top: -60, behavior: 'smooth' });
        setTimeout(() => showStep(0), 500);
      };
      
      dots.forEach((btn, idx) => btn.onclick = () => showStep(idx));
      
      /* ---------- nothing else to recalc on resize -------------------------
         (centre of viewport is always 50 % / 50 %)                         */
      