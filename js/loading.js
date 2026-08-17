const loader = document.querySelector("#loader");
const page = document.querySelector("#page") || document.querySelector("#main");
const progressBar = document.querySelector("#progress");
const percentLabel = document.querySelector("#percent");
const clock = document.querySelector("#clock");

function updateClock() {
  if (!clock) return;
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  clock.textContent = `${hours}:${minutes}`;
}

const skipLoading = sessionStorage.getItem("rubySkipNextLoader") === "true";
const requestedLoading = sessionStorage.getItem("rubyShowNextLoader") === "true";
sessionStorage.removeItem("rubyShowNextLoader");

if (skipLoading || !requestedLoading) {
  sessionStorage.removeItem("rubySkipNextLoader");
  if (loader) loader.classList.add("is-hidden");
  if (page) page.classList.add("is-ready");
} else {
  // Every page uses the same fixed 1.8-second progress period.
  const loadingDuration = 1800;
  const loadingStartedAt = Date.now();
  const loadingTimer = setInterval(() => {
    const elapsed = Date.now() - loadingStartedAt;
    const loadingProgress = Math.min(100, Math.floor((elapsed / loadingDuration) * 100));

    if (loadingProgress >= 100) {
      clearInterval(loadingTimer);

      setTimeout(() => {
        if (loader) loader.classList.add("is-hidden");
        if (page) page.classList.add("is-ready");
      }, 250);
    }

    if (progressBar) progressBar.style.width = `${loadingProgress}%`;
    if (percentLabel) percentLabel.textContent = loadingProgress;
  }, 50);

  updateClock();
  setInterval(updateClock, 5000);
}
