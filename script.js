const totalFiles = 20;
const container = document.getElementById("audio-container");

/* ===== AUTO PARTICIPANT ID ===== */
function generateID() {
  return "P-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

document.getElementById("participant_id").value = generateID();

/* ===== DEFINE CORRECT ANSWERS ===== */
const correctAnswers = {
  audio1: "Real",
  audio2: "Real",
  audio3: "Fake",
  audio4: "Real",
  audio5: "Fake",
  audio6: "Fake",
  audio7: "Real",
  audio8: "Real",
  audio9: "Fake",
  audio10: "Fake",
  audio11: "Fake",
  audio12: "Real",
  audio13: "Real",
  audio14: "Fake",
  audio15: "Fake",
  audio16: "Real",
  audio17: "Fake",
  audio18: "Fake",
  audio19: "Real",
  audio20: "Real"
};

/* ===== GENERATE AUDIO BLOCKS ===== */
for (let i = 1; i <= totalFiles; i++) {
  const block = document.createElement("div");
  block.className = "audio-block";

  block.innerHTML = `
    <h3>Audio ${i}</h3>
    <audio controls>
      <source src="audio/audio${i}.wav" type="audio/wav">
    </audio>

    <div class="button-group">
      <input type="radio" id="real${i}" name="audio${i}" value="Real" required hidden>
      <label for="real${i}" class="oval-btn">Real</label>

      <input type="radio" id="fake${i}" name="audio${i}" value="Fake" hidden>
      <label for="fake${i}" class="oval-btn">Fake</label>
    </div>
  `;

  container.appendChild(block);
}

/* ===== GOOGLE SHEETS SUBMISSION ===== */
const scriptURL = "https://script.google.com/macros/s/AKfycbxu7kjUhr5mE1nrgWXvpzR0rncH-QfzhsfsT63Is8Abphgwr-605DyIR4LaubBZZptp/exec";

let startTime = Date.now();

document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();

  let score = 0;
  let answers = [];

  for (let i = 1; i <= totalFiles; i++) {
    const selected = document.querySelector(`input[name="audio${i}"]:checked`);

    if (!selected) {
      alert(`Please answer Audio ${i}`);
      return;
    }

    let val = selected.value;
    answers.push(val);

    if (val === correctAnswers[`audio${i}`]) {
      score++;
    }
  }

  const data = {
    participant_id: document.getElementById("participant_id").value,
    score: score,
    response_time: (Date.now() - startTime) / 1000,
    answers: answers
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(() => {
    window.location.href = "/success";
  })
  .catch(err => {
    console.error("Error:", err);
    alert("Submission failed. Try again.");
  });
});
