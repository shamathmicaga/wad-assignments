/* ===== ASSIGNMENT 9: Client-side validation with error messages ===== */
const form = document.getElementById("bookingForm");
const $ = (id) => document.getElementById(id);

function setError(field, message) {
  $(field + "Error").textContent = message;
  $(field).classList.toggle("invalid", Boolean(message));
  return !message;
}

const validators = {
  name: () => {
    const v = $("name").value.trim();
    if (!v) return setError("name", "Please enter your full name.");
    if (!/^[A-Za-z ]{3,}$/.test(v)) return setError("name", "Use letters only, at least 3 characters.");
    return setError("name", "");
  },
  email: () => {
    const v = $("email").value.trim();
    if (!v) return setError("email", "Please enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setError("email", "Enter a valid email, e.g. name@example.com.");
    return setError("email", "");
  },
  phone: () => {
    const v = $("phone").value.trim();
    if (!v) return setError("phone", "Please enter your phone number.");
    if (!/^[6-9]\d{9}$/.test(v)) return setError("phone", "Enter a 10-digit Indian mobile number starting with 6-9.");
    return setError("phone", "");
  },
  destination: () => $("destination").value ? setError("destination", "") : setError("destination", "Please choose a destination."),
  date: () => {
    const v = $("date").value;
    if (!v) return setError("date", "Please pick a travel date.");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (new Date(v) < today) return setError("date", "Travel date cannot be in the past.");
    return setError("date", "");
  },
  travellers: () => {
    const n = Number($("travellers").value);
    if (!Number.isInteger(n) || n < 1 || n > 10) return setError("travellers", "Travellers must be a whole number from 1 to 10.");
    return setError("travellers", "");
  }
};

// Live validation on blur / change
Object.keys(validators).forEach((f) => {
  $(f).addEventListener("blur", validators[f]);
  $(f).addEventListener("input", () => { if ($(f).classList.contains("invalid")) validators[f](); updateSummary(); });
});

// Booking summary
function updateSummary() {
  const sel = $("destination");
  const price = Number(sel.value) || 0;
  const n = Number($("travellers").value) || 0;
  $("sumDest").textContent = sel.value ? sel.options[sel.selectedIndex].text.split(" –")[0] : "–";
  $("sumTrav").textContent = n || "–";
  $("sumDate").textContent = $("date").value || "–";
  $("sumTotal").textContent = "₹" + (price * n).toLocaleString("en-IN");
}
$("destination").addEventListener("change", updateSummary);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  $("successMsg").hidden = true;
  const results = Object.values(validators).map((fn) => fn()); // run all so every error shows
  if (results.every(Boolean)) {
    $("successMsg").hidden = false;
    form.reset();
    $("travellers").value = 1;
    updateSummary();
  } else {
    form.querySelector(".invalid").focus();
  }
});
