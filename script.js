/* ============ 1) سلايدر الفعاليات البارزة (index.html) ============ */
function initSlider(){
  const track = document.querySelector('.slider-track');
  if(!track) return;
  const slides = track.children;
  const dotsWrap = document.querySelector('.slider-dots');
  let current = 0;

  slides && Array.from(slides).forEach((_, i) => {
    const dot = document.createElement('button');
    if(i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function update(){
    track.style.transform = `translateX(${current * 100}%)`;
    document.querySelectorAll('.slider-dots button').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }
  function goTo(i){
    current = (i + slides.length) % slides.length;
    update();
  }
  document.querySelector('.slider-prev').addEventListener('click', () => goTo(current - 1));
  document.querySelector('.slider-next').addEventListener('click', () => goTo(current + 1));

  // تبديل تلقائي كل 5 ثواني
  setInterval(() => goTo(current + 1), 5000);
  update();
}

/* ============ 2) فلترة الفعاليات (events.html) ============ */
function initEventsFilter(){
  const grid = document.getElementById('eventsGrid');
  if(!grid) return;
  const cards = Array.from(grid.querySelectorAll('.event-item'));
  const searchInput = document.getElementById('searchInput');
  const categorySelect = document.getElementById('categoryFilter');
  const dateInput = document.getElementById('dateFilter');
  const emptyMsg = document.getElementById('emptyMsg');

  function applyFilters(){
    const q = searchInput.value.trim().toLowerCase();
    const cat = categorySelect.value;
    const date = dateInput.value;
    let visibleCount = 0;

    cards.forEach(card => {
      const title = card.dataset.title.toLowerCase();
      const matchesSearch = !q || title.includes(q);
      const matchesCat = cat === 'all' || card.dataset.category === cat;
      const matchesDate = !date || card.dataset.date === date;
      const show = matchesSearch && matchesCat && matchesDate;
      card.style.display = show ? '' : 'none';
      if(show) visibleCount++;
    });
    emptyMsg.classList.toggle('d-none', visibleCount !== 0);
  }

  [searchInput, categorySelect, dateInput].forEach(el => {
    el.addEventListener('input', applyFilters);
  });

  // فلترة تلقائية عند القدوم من رابط يحمل ?category=
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('category');
  if(catParam){
    categorySelect.value = catParam;
    applyFilters();
  }
}

/* ============ 3) نموذج اتصل بنا (contact.html) ============ */
function initContactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  const alertBox = document.getElementById('formAlert');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('nameField');
    const email = document.getElementById('emailField');
    const message = document.getElementById('messageField');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let valid = true;
    [name, email, message].forEach(f => f.classList.remove('is-invalid'));

    if(name.value.trim().length < 2){ name.classList.add('is-invalid'); valid = false; }
    if(!emailPattern.test(email.value.trim())){ email.classList.add('is-invalid'); valid = false; }
    if(message.value.trim().length < 5){ message.classList.add('is-invalid'); valid = false; }

    alertBox.classList.remove('d-none', 'alert-success', 'alert-danger');
    if(valid){
      alertBox.classList.add('alert-success');
      alertBox.textContent = 'تم إرسال رسالتك بنجاح، سنتواصل معك قريبًا.';
      form.reset();
    } else {
      alertBox.classList.add('alert-danger');
      alertBox.textContent = 'يرجى تصحيح الحقول المميزة باللون الأحمر قبل الإرسال.';
    }
  });
}

/* ============ 4) أضف للتقويم + مشاركة (صفحات event-1.html ... event-6.html) ============ */
/*
  ملاحظة: صفحات تفاصيل الفعاليات صارت صفحات ثابتة (Static)، كل صفحة تكتب
  عنوانها وتاريخها وصورتها يدويًا بالـ HTML مباشرة. هاد الجزء من الجافاسكربت
  بيتعامل بس مع زر "أضف للتقويم" و "شارك"، وبياخد القيم من data-title و
  data-date الموجودين مباشرة على الزر بكل صفحة — بدون أي بيانات تلقائية.
*/
function initEventDetailActions(){
  const calendarBtn = document.getElementById('addToCalendarBtn');
  const shareBtn = document.getElementById('shareBtn');
  if(calendarBtn){
    calendarBtn.addEventListener('click', () => {
      const title = calendarBtn.dataset.title;
      const date = calendarBtn.dataset.date.replace(/-/g, '');
      const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${title}\nDTSTART;VALUE=DATE:${date}\nDTEND;VALUE=DATE:${date}\nEND:VEVENT\nEND:VCALENDAR`;
      const blob = new Blob([ics], { type: 'text/calendar' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.ics`;
      link.click();
    });
  }
  if(shareBtn){
    shareBtn.addEventListener('click', async () => {
      const url = window.location.href;
      if(navigator.share){
        navigator.share({ title: document.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        shareBtn.textContent = 'تم نسخ الرابط ✓';
        setTimeout(() => shareBtn.textContent = 'شارك الفعالية', 2000);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initEventsFilter();
  initContactForm();
  initEventDetailActions();
});
