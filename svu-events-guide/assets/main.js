// ملف JavaScript بسيط مع تعليقات توضيحية

// سلايدر بسيط للفعاليات البارزة في الصفحة الرئيسية
document.addEventListener("DOMContentLoaded", function () {
    const sliderItems = document.querySelectorAll(".slider-item");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    let currentIndex = 0;

    function showSliderItem(index) {
        sliderItems.forEach((item, i) => {
            item.style.display = (i === index) ? "block" : "none";
        });
    }

    if (sliderItems.length > 0) {
        showSliderItem(currentIndex);

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener("click", function () {
                currentIndex--;
                if (currentIndex < 0) {
                    currentIndex = sliderItems.length - 1;
                }
                showSliderItem(currentIndex);
            });

            nextBtn.addEventListener("click", function () {
                currentIndex++;
                if (currentIndex >= sliderItems.length) {
                    currentIndex = 0;
                }
                showSliderItem(currentIndex);
            });
        }
    }

    // فلترة الفعاليات في صفحة events.html
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const dateFilter = document.getElementById("dateFilter");
    const eventsList = document.getElementById("eventsList");

    function filterEvents() {
        if (!eventsList) return;

        const items = eventsList.querySelectorAll(".event-item");
        const searchText = searchInput ? searchInput.value.toLowerCase() : "";
        const categoryValue = categoryFilter ? categoryFilter.value : "";
        const dateValue = dateFilter ? dateFilter.value : "";

        items.forEach(item => {
            const title = item.querySelector(".card-title").textContent.toLowerCase();
            const category = item.getAttribute("data-category");
            const date = item.getAttribute("data-date");

            let visible = true;

            if (searchText && !title.includes(searchText)) {
                visible = false;
            }

            if (categoryValue && category !== categoryValue) {
                visible = false;
            }

            if (dateValue && date !== dateValue) {
                visible = false;
            }

            item.style.display = visible ? "block" : "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterEvents);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterEvents);
    }
    if (dateFilter) {
        dateFilter.addEventListener("change", filterEvents);
    }

    // تحقق نموذج اتصل بنا في contact.html
    const contactForm = document.getElementById("contactForm");
    const formAlert = document.getElementById("formAlert");

    function validateEmail(email) {
        // تحقق بسيط لصيغة البريد
        return email.includes("@") && email.includes(".");
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) {
                formAlert.className = "alert alert-danger";
                formAlert.textContent = "الرجاء تعبئة جميع الحقول المطلوبة.";
                formAlert.classList.remove("d-none");
                return;
            }

            if (!validateEmail(email)) {
                formAlert.className = "alert alert-warning";
                formAlert.textContent = "صيغة البريد الإلكتروني غير صحيحة.";
                formAlert.classList.remove("d-none");
                return;
            }

            // في مشروع حقيقي هنا يتم إرسال البيانات للسيرفر
            formAlert.className = "alert alert-success";
            formAlert.textContent = "تم إرسال الرسالة بنجاح. شكراً لتواصلك معنا.";
            formAlert.classList.remove("d-none");

            // إعادة تعيين النموذج
            contactForm.reset();
        });
    }
});
