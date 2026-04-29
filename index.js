const { Lunar } = require('lunar-javascript');
const fs = require('fs');

function build(year) {

  let events = [];

  function add(date, title) {
    let d = new Date(date);
    let str = d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    events.push(`BEGIN:VEVENT
DTSTART:${str}
SUMMARY:${title}
END:VEVENT`);
  }

  for (let m = 1; m <= 12; m++) {

    // 🌕 First day of lunar month
    let first = Lunar.fromYmd(year, m, 1).getSolar().toDate();
    add(first, "🙏 First Day Prayer");
    add(new Date(first.getTime() - 3*86400000), "🛒 Buy Fruits");

    // 🌕 15th day
    let fifteenth = Lunar.fromYmd(year, m, 15).getSolar().toDate();
    add(fifteenth, "🙏 15th Day Prayer");
    add(new Date(fifteenth.getTime() - 3*86400000), "🛒 Buy Fruits");
  }

  // 🎉 :contentReference[oaicite:1]{index=1} birthday (lunar 10th month 14th day)
  let jigong = Lunar.fromYmd(year, 10, 14).getSolar().toDate();

  add(new Date(jigong.getTime() - 5*86400000), "🎋 Ji Gong Preparation");
  add(jigong, "🙏 Ji Gong Birthday Prayer");

  return `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
${events.join("\n")}
END:VCALENDAR`;
}

// generate file
let year = new Date().getFullYear();
fs.writeFileSync("calendar.ics", build(year));

console.log("Calendar generated successfully");
