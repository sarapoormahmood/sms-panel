const smsForm = document.getElementById("smsForm");

const messageInput = document.getElementById("message");
const characterCount = document.getElementById("characterCount");
const characterLimit = document.getElementById("characterLimit");

const scheduleToggle = document.getElementById("scheduleToggle");
const scheduleFields = document.getElementById("scheduleFields");

const recipientsInput = document.getElementById("recipients");
const scheduleTime = document.getElementById("scheduleTime");

const recipientError = document.getElementById("recipientError");



// Tagify - شماره گیرنده


const tagify = new Tagify(recipientsInput, {
  delimiters: ",| ",
  dropdown: {
    enabled: 0
  },

  validate: function (tagData) {
    const phone = tagData.value.trim();

    return /^09\d{9}$/.test(phone);
  }
});



// خطای شماره گیرنده


tagify.on("invalid", function () {
  alert("شماره تماس وارد شده اشتباه است");
});



// شمارنده کاراکتر پیام


function updateCharacterCount() {
  const currentLength = messageInput.value.length;
  const maxLength = messageInput.maxLength;

  characterCount.textContent = currentLength;
  characterLimit.textContent = maxLength;
}

messageInput.addEventListener("input", updateCharacterCount);

updateCharacterCount();



// نمایش / مخفی کردن زمان‌بندی


scheduleToggle.addEventListener("change", () => {

  if (scheduleToggle.checked) {
    scheduleFields.classList.remove("hidden");
  } else {
    scheduleFields.classList.add("hidden");
  }

});

// انتخاب نوع تاریخ


const dateTypeButtons =
  document.querySelectorAll(".date-type-btn");

const jalaliDateField =
  document.getElementById("jalaliDateField");

const gregorianDateField =
  document.getElementById("gregorianDateField");

dateTypeButtons.forEach((button) => {

  button.addEventListener("click", () => {

    dateTypeButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");


    if (button.dataset.type === "jalali") {

      jalaliDateField.classList.remove("hidden");
      gregorianDateField.classList.add("hidden");

    } else {

      jalaliDateField.classList.add("hidden");
      gregorianDateField.classList.remove("hidden");

    }

  });

});



// تقویم شمسی - Azar Datepicker


const jalaliInput =
  document.getElementById("jalaliDate");

let jalaliDatePicker = null;


try {

  jalaliDatePicker = new AzarDatepicker({

    selector: "#jalaliDate",

    calendar: "jalali",

    mode: "date",

    inputFormat: "YYYY/MM/DD",

    closeOnSelect: true,

    // نمایش ضربدر پاک کردن
    showClearButton: true,

    // فقط تقویم شمسی
    // دکمه تغییر به میلادی داخل خود picker نمی‌خواهیم
    showCalendarToggle: false

  });

} catch (error) {

  console.error(
    "خطا در راه‌اندازی تقویم شمسی:",
    error
  );

}



// پاک کردن همه شماره‌ها


const clearRecipients =
  document.getElementById("clearRecipients");

clearRecipients.addEventListener("click", () => {

  tagify.removeAllTags();

  recipientError.classList.add("hidden");

});



// ارسال فرم


smsForm.addEventListener("submit", (event) => {

  event.preventDefault();

  const message =
    messageInput.value.trim();



  // بررسی متن پیام


  if (!message) {

    alert(".لطفا متن پیامک را وارد کنید");
    messageInput.focus();

    return;
  }



  // بررسی شماره گیرنده


  const recipients =
    tagify.value;

  if (recipients.length === 0) {

    alert(".حداقل یک شماره گیرنده وارد کنید");

    recipientsInput.focus();

    return;
  }



  // بررسی زمان‌بندی


  if (scheduleToggle.checked) {

    const activeDateButton =
      document.querySelector(".date-type-btn.active");


    if (!activeDateButton) {

      alert(".لطفا نوع تاریخ را مشخص کنید");

      return;
    }


    const activeDateType =
      activeDateButton.dataset.type;

    const now = new Date();



    // تاریخ شمسی


    if (activeDateType === "jalali") {

      const jalaliDate =
        jalaliInput.value.trim();


      if (!jalaliDate) {

        alert(".لطفا تاریخ شمسی ارسال را مشخص کنید");

        jalaliInput.focus();

        return;
      }

    }



    // تاریخ میلادی


    else {

      const gregorianDate =
        document.getElementById("scheduleDate").value;


      if (!gregorianDate) {

        alert(".لطفا تاریخی میلادی ارسال را مشخص کنید");

        document
          .getElementById("scheduleDate")
          .focus();

        return;
      }


      const selectedDate =
        new Date(gregorianDate + "T00:00:00");


      const today =
        new Date();

      today.setHours(0, 0, 0, 0);


      if (selectedDate < today) {

        alert(".تاریخ ارسال نمیتواند در گذشته باشد");

        return;
      }

    }



    // بررسی ساعت


    const selectedTime =
      scheduleTime.value;


    if (!selectedTime) {

      alert(".لطفا ساعت ارسال را مشخص کنید");

      scheduleTime.focus();

      return;
    }


    const [hours, minutes] =
      selectedTime.split(":");


    const selectedHours =
      Number(hours);

    const selectedMinutes =
      Number(minutes);



    // اگر تاریخ میلادی امروز باشد،
    // ساعت گذشته مجاز نیست


    if (activeDateType === "gregorian") {

      const selectedDate =
        document.getElementById("scheduleDate").value;


      const nowDate =
        new Date();


      const today =
        nowDate.getFullYear() +
        "-" +
        String(
          nowDate.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
          nowDate.getDate()
        ).padStart(2, "0");


      if (selectedDate === today) {

        const currentMinutes =
          nowDate.getHours() * 60 +
          nowDate.getMinutes();


        const selectedTotalMinutes =
          selectedHours * 60 +
          selectedMinutes;


        if (
          selectedTotalMinutes <=
          currentMinutes
        ) {

          alert(
            ".ساعت ارسال نمی تواند در گذشته باشد"
          );

          scheduleTime.focus();

          return;
        }

      }

    }

  }



  // نمایش Modal تأیید ارسال


  const confirmModal =
    document.getElementById("confirmModal");


  if (confirmModal) {

    confirmModal.classList.remove("hidden");

  }

});



// Modal تأیید ارسال


const confirmSend =
  document.getElementById("confirmSend");

const cancelSend =
  document.getElementById("cancelSend");

const confirmModal =
  document.getElementById("confirmModal");



// انصراف


if (cancelSend) {

  cancelSend.addEventListener("click", () => {

    confirmModal.classList.add("hidden");

  });

}



// تأیید ارسال


if (confirmSend) {

  confirmSend.addEventListener("click", () => {

    confirmModal.classList.add("hidden");

    showSuccessToast();

    resetForm();

  });

}


// Toast موفقیت


function showSuccessToast() {

  let toast =
    document.getElementById("successToast");


  if (!toast) {

    toast =
      document.createElement("div");

    toast.id =
      "successToast";


    toast.className =
      "fixed top-5 right-5 z-[9999] flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow";


    toast.innerHTML = `
      <div class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
        ✓
      </div>

      <div class="ms-3 text-sm font-normal">
      .پیامک با موفقیت ارسال شد
      </div>
    `;


    document.body.appendChild(toast);

  }


  toast.classList.remove("hidden");


  setTimeout(() => {

    toast.remove();

  }, 3000);

}



// پاک کردن فرم


function resetForm() {

  // متن پیام
  messageInput.value = "";


  // شماره‌ها
  tagify.removeAllTags();


  // زمان‌بندی
  scheduleToggle.checked = false;

  scheduleFields.classList.add("hidden");


  // ساعت
  scheduleTime.value = "";


  // تاریخ میلادی
  const gregorianDate =
    document.getElementById("scheduleDate");


  if (gregorianDate) {

    gregorianDate.value = "";

  }


  // تاریخ شمسی
  // از API خود Datepicker برای پاک کردن استفاده می‌کنیم
  if (jalaliDatePicker) {

    jalaliDatePicker.setValue(null);

  } else if (jalaliInput) {

    jalaliInput.value = "";

  }


  // برگشت به حالت شمسی
  dateTypeButtons.forEach((btn) => {

    btn.classList.remove("active");

  });


  const jalaliButton =
    document.querySelector(
      '.date-type-btn[data-type="jalali"]'
    );


  if (jalaliButton) {

    jalaliButton.classList.add("active");

  }


  jalaliDateField.classList.remove("hidden");

  gregorianDateField.classList.add("hidden");


  // شمارنده
  updateCharacterCount();

}