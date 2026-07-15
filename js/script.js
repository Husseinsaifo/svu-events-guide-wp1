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

/* ============ 4) بيانات الفعاليات وعرض صفحة التفاصيل (event.html) ============ */
const EVENTS_DATA = {
  1: { title:'افتتاح الأسبوع الثقافي', category:'ثقافة', date:'2026-08-10', location:'القاعة الكبرى',
       desc:'حفل افتتاح الأسبوع الثقافي بمشاركة نخبة من الطلاب والأساتذة، ويتضمن معارض فنية ومحاضرات ثقافية متنوعة على مدار الأسبوع.', img :'src=img/1.jpg' },
  2: { title:'دوري كرة القدم بين الكليات', category:'رياضة', date:'2026-08-15', location:'الملعب الجامعي',
       desc:'منافسة رياضية سنوية تجمع فرق الكليات المختلفة في دوري كرة قدم مثير، مع جوائز للفريق الفائز وأفضل لاعب.', img:'event2' },
  3: { title:'أمسية موسيقية تحت النجوم', category:'موسيقى', date:'2026-08-20', location:'المدرج الخارجي',
       desc:'أمسية موسيقية في الهواء الطلق يقدمها فرقة الجامعة الموسيقية، تضم مزيجًا من الموسيقى الكلاسيكية والمعاصرة.', img:'event3' },
  4: { title:'ورشة تطوير تطبيقات الويب', category:'تقنية', date:'2026-08-25', location:'مخبر الحاسوب 2',
       desc:'ورشة عملية تدريبية حول أساسيات تطوير تطبيقات الويب باستخدام HTML وCSS وJavaScript وBootstrap، مخصصة لطلاب السنة الثانية.', img:'event4' },
  5: { title:'معرض الكتاب الجامعي السنوي', category:'ثقافة', date:'2026-09-01', location:'الساحة المركزية',
       desc:'معرض سنوي يضم دور نشر محلية وعالمية، مع خصومات خاصة للطلاب وجلسات توقيع لبعض المؤلفين.', img:'event5' },
  6: { title:'يوم العائلة الجامعي', category:'عائلي', date:'2026-09-05', location:'الحديقة الجامعية',
       desc:'يوم ترفيهي مخصص لعائلات الطلاب والموظفين، يتضمن ألعابًا وأنشطة للأطفال ومسابقات جماعية.', img:'event6' }
};

function initEventDetailPage(){
  const wrap = document.getElementById('eventDetail');
  if(!wrap) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 1;
  const ev = EVENTS_DATA[id] || EVENTS_DATA[1];

  document.title = ev.title + ' — دليل فعاليات الجامعة';
  document.getElementById('evTitle').textContent = ev.title;
  document.getElementById('evCategory').textContent = ev.category;
  document.getElementById('evDate').textContent = ev.date;
  document.getElementById('evLocation').textContent = ev.location;
  document.getElementById('evDesc').textContent = ev.desc;
  document.getElementById('evImage').src = `https://picsum.photos/seed/${ev.img}/900/380`;
  document.querySelectorAll('.evGalleryImg').forEach((img, i) => {
    img.src = `https://picsum.photos/seed/${ev.img}-${i}/220/150`;
  });

  const calendarBtn = document.getElementById('addToCalendarBtn');
  calendarBtn.dataset.title = ev.title;
  calendarBtn.dataset.date = ev.date;

  // فعاليات ذات صلة (نفس التصنيف، باستثناء الفعالية الحالية)
  const relatedWrap = document.getElementById('relatedEvents');
  const related = Object.entries(EVENTS_DATA)
    .filter(([key, val]) => key != id && val.category === ev.category)
    .slice(0, 3);
  relatedWrap.innerHTML = related.map(([key, val]) => `
    <div class="col-md-4">
      <div class="ticket-card">
        <img src="https://picsum.photos/seed/${val.img}/400/260" alt="${val.title}">
        <div class="ticket-body">
          <h3>${val.title}</h3>
          <p class="ticket-meta">${val.date} — ${val.location}</p>
        </div>
        <div class="ticket-stub">
          <span class="badge bg-light text-dark border">${val.category}</span>
          <a href="event.html?id=${key}" class="btn btn-sm btn-outline-navy">التفاصيل</a>
        </div>
      </div>
    </div>`).join('') || '<p class="text-muted">لا توجد فعاليات ذات صلة حاليًا.</p>';
}

/* ============ 5) أضف للتقويم + مشاركة (event.html) ============ */
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
  initEventDetailPage();
  initEventDetailActions();
});
