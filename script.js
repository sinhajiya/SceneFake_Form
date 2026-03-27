const totalFiles = 20;
const container = document.getElementById("audio-container");
const form = document.getElementById("quiz-form");


function generateID() {
  return "P-" + crypto.randomUUID();
}
document.getElementById("participant_id").value = generateID();


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


for (let i = 1; i <= totalFiles; i++) {
  const block = document.createElement("div");
  block.className = "audio-block";

  block.innerHTML = `
    <h3>Audio ${i}</h3>
    <audio controls>
      <source src="audio/audio${i}.wav" type="audio/wav">
    </audio>

    <div class="button-group">
      <input type="radio" id="real${i}" name="audio${i}" value="Real" hidden>
      <label for="real${i}" class="oval-btn">Real</label>

      <input type="radio" id="fake${i}" name="audio${i}" value="Fake" hidden>
      <label for="fake${i}" class="oval-btn">Fake</label>
    </div>
  `;

  container.appendChild(block);
}

const scriptURL = "https://script.google.com/macros/s/AKfycbyr-LqazWHPYT9FtrTNFGlkdYQZZnWFa01cSMuHsZLzZCdhpe2l2RF7QFaSYpdCy_63/exec";

let startTime = Date.now();

form.addEventListener("submit", function(e) {
  e.preventDefault();

  let score = 0;
  let answers = [];
  let missing = [];

  const blocks = document.querySelectorAll(".audio-block");

  for (let i = 1; i <= totalFiles; i++) {
    const selected = document.querySelector(`input[name="audio${i}"]:checked`);
    const block = blocks[i - 1];

    if (!selected) {
      missing.push(i);
      block.style.border = "2px solid #e75480";
    } else {
      block.style.border = "1px solid #eee";

      const val = selected.value;
      answers.push(val);

      if (val === correctAnswers[`audio${i}`]) {
        score++;
      }
    }
  }

  if (missing.length > 0) {
    const warningBox = document.getElementById("warningBox");
    warningBox.style.display = "block";
    warningBox.innerText = `Please answer all samples. Missing: ${missing.join(", ")}`;

    blocks[missing[0] - 1].scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    return;
  }

  const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);

  const data = {
    participant_id: document.getElementById("participant_id").value,
    score: score,
    response_time: responseTime,
    answers: answers
  };

  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting...";

 
  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(() => {
    const percent = ((score / totalFiles) * 100).toFixed(1);
    window.location.href = `success.html?score=${score}&percent=${percent}`;
  })
  .catch(() => {
    alert("Submission may have failed");
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit Responses";
  });
});
