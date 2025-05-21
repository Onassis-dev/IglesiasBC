function formatToTZ(dateStr) {
  if (dateStr === null) return null;

  const inputDate = new Date(dateStr);
  if (isNaN(inputDate.getTime())) return null;

  const offsetAtDate = inputDate.getTimezoneOffset() * 60 * 1000;

  return new Date(inputDate.getTime() + offsetAtDate);
}

function formatAllDayEvent(date) {
  const start = date.toISOString().slice(0, 10).replace(/-/g, "");
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);
  const end = endDate.toISOString().slice(0, 10).replace(/-/g, "");
  return `${start}/${end}`;
}

async function shareEvent(url, title, social) {
  if (social === "facebook") {
    const FB_LINK = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
    window.open(FB_LINK, "_blank");
  } else if (social === "whatsapp") {
    const WA_LINK = `https://wa.me/?text=${title}%20${url}`;
    window.open(WA_LINK, "_blank");
  } else if (social === "copy") {
    await navigator.clipboard.writeText(url);
  }
}

function setUpCalendarButtons() {
  const calendarButtons = document.querySelectorAll(".calendar-btn");

  calendarButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const event = button.dataset;
      window.open(
        `https://www.google.com/calendar/render?action=TEMPLATE&text=${event.title}&dates=${formatAllDayEvent(formatToTZ(event.date))}&details=${event.description}`,
        "_blank"
      );
    });
  });
}

function setUpShareButtons() {
  const shareButtons = document.querySelectorAll(".share-btn");
  shareButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const event = button.dataset;
      const shareToggle = button.nextElementSibling;
      const url = `${window.location.origin}${window.location.pathname}?evento=${event.title}`;

      shareToggle
        .querySelector(".copy-btn")
        ?.addEventListener("click", () => shareEvent(url, event.title, "copy"));
      shareToggle
        .querySelector(".whatsapp-btn")
        ?.addEventListener("click", () =>
          shareEvent(url, event.title, "whatsapp")
        );
      shareToggle
        .querySelector(".facebook-btn")
        ?.addEventListener("click", () =>
          shareEvent(url, event.title, "facebook")
        );

      if (navigator.share) {
        navigator.share({
          title: event.title,
          text: event.description,
          url: `${window.location.origin}${window.location.pathname}?evento=${event.title}`,
        });
      } else {
        const eventListener = (e) => {
          if (e.target !== button) shareToggle.classList.add("hidden");
        };

        if (shareToggle.classList.contains("hidden")) {
          shareToggle.classList.remove("hidden");
          document.body.addEventListener("click", eventListener);
        } else {
          shareToggle.classList.add("hidden");
          document.body.removeEventListener("click", eventListener);
        }
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setUpCalendarButtons();
  setUpShareButtons();
});
