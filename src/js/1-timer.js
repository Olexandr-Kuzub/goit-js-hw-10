import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const startBtnEl = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

startBtnEl.disabled = true;

let userSelectedDate = null;
let intervalId = null;


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
    minuteIncrement: 1,
  
  onClose(selectedDates) {
      const selectDate = selectedDates[0]
      const currentDate = new Date();

      if (selectDate <= currentDate) {
          startBtnEl.disabled = true;

          iziToast.error({
    title: 'Error',
    message: 'Please choose a date in the future',
          });
          return;
      }
      userSelectedDate = selectDate;
      startBtnEl.disabled = false;
  },
};


flatpickr(input, options);

startBtnEl.addEventListener('click', () => {
    startBtnEl.disabled = true;
    input.disabled = true;

    intervalId = setInterval(() => {
        const currentTime = new Date();
        const timeLeft = userSelectedDate - currentTime;

        if (timeLeft <= 0) {
            clearInterval(intervalId);

            updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });

            input.disabled = false;
            startBtnEl.disabled = true;
            return;
        }

        const time = convertMs(timeLeft);
        updateTimer(time);
    }, 1000);
})

function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}



function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}