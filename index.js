const containerElement = document.querySelector(".container");
const input = document.querySelector(".input");
let currentTime;

var timer = null;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const element = entry.target;
      if (entry.isIntersecting) {
        input.value = element.textContent;
        currentTime = element;
      }
      element.classList.toggle("selected", entry.isIntersecting);
    });
  },
  {
    root: containerElement,
    threshold: 0.3,
  }
);

const createTime = (start = false) => {
  for (let hour = 0; hour < 25; hour++) {
    const hourString = hour.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    const time = document.createElement("div");
    time.textContent = hourString;
    time.classList.add("time");
    time.id = `id${hourString}`;
    start ? containerElement.prepend(time) : containerElement.appendChild(time);

    observer.observe(time);
  }
};

const scrollIntoCenter = (elementToScroll, smooth = true) => {
  elementToScroll.scrollIntoView({
    behavior: smooth ? "smooth" : "auto",
    block: "center",
    inline: "center",
  });
};

const getRelativePostoConainer = (element) => {
  const parentPos = document
    .querySelector(".container")
    .getBoundingClientRect();
  const childPos = element.getBoundingClientRect();

  return {
    top: childPos.top - parentPos.top,
    right: childPos.right - parentPos.right,
    bottom: childPos.bottom - parentPos.bottom,
    left: childPos.left - parentPos.left,
  };
};

const lastTimeObserver = new IntersectionObserver(
  (entries) => {
    const lastTime = entries[0];
    if (!lastTime.isIntersecting) return;
    createTime();
    lastTimeObserver.unobserve(lastTime.target);
    lastTimeObserver.observe(document.querySelector(".time:last-child"));
  },
  {
    root: containerElement,
    rootMargin: "150px",
  }
);

const firstTimeObserver = new IntersectionObserver(
  (entries) => {
    const firstTime = entries[0];
    if (!firstTime.isIntersecting) return;
    createTime(true);
    firstTimeObserver.unobserve(firstTime.target);
    firstTimeObserver.observe(document.querySelector(".time:first-child"));
  },
  {
    root: containerElement,
    rootMargin: "150px",
  }
);

createTime();
createTime();

const start = document.querySelectorAll("#id00")[1];
scrollIntoCenter(start, false);

lastTimeObserver.observe(document.querySelector(".time:last-child"));
firstTimeObserver.observe(document.querySelector(".time:first-child"));

containerElement.addEventListener(
  "scroll",
  () => {
    if (timer !== null) clearTimeout(timer);

    timer = setTimeout(() => {
      if (!currentTime) return;
      scrollIntoCenter(currentTime);
      // input.value = currentTime.textContent;
    }, 200);
  },
  false
);
