export default class SetDate {
  constructor(options) {
    this.dateEl = options.dateEl;
    this.init();
  }

  init() {
    this.indexTick = false;

    this.getTime();
    setInterval(() => {
      this.getTime();
    }, 1000);
  }

  getTime() {
    const date = new Date();
    const time = {
      day: date.getUTCDate(),
      month: date.getUTCMonth(),
      year: date.getUTCFullYear(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };

    this.indexTick = !this.indexTick;

    this.displayTime(time);
  }

  displayTime(time) {
    // Format time
    time.month = time.month + 1;
    time.year = time.year.toString().slice(2);
    Object.keys(time).map((timeEl) => {
      if (time[timeEl].toString().length < 2) {
        time[timeEl] = "0" + time[timeEl];
      }
    });

    const { day, month, year, hours, minutes } = time;
    this.dateEl.innerHTML = `
      <p>${hours}<span class='tick'>:</span>${minutes}</p>
      <p>${day}.${month}.${year}</p>
    `;

    // Tick Flash
    this.tickEl = document.querySelector(".tick");
    this.tickEl.style.opacity = this.indexTick ? 1 : 0.7;
  }
}
