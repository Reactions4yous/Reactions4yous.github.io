const nextBtn = document.querySelector(".next-btn");
const backBtn = document.querySelector(".back-btn");
const scoreContainer = document.getElementById("scoreContainer");

let current = 1;
let totalQuestions = 2; // Update if you add more
const correctAnswers = {
  q1: "C",
  q2: "B"
};

function showQuestion(num) {
  for (let i = 1; i <= totalQuestions; i++) {
    const q = document.getElementById(`question${i}`);
    if (q) q.style.display = i === num ? "block" : "none";
  }
}

nextBtn.addEventListener("click", () => {
  if (current < totalQuestions) {
    current++;
    showQuestion(current);
  } else {
    // Finish the quiz
    let score = 0;
    let total = Object.keys(correctAnswers).length;
    for (let i = 1; i <= total; i++) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (selected && selected.value === correctAnswers[`q${i}`]) {
        score++;
      }
    }

    document.querySelector(".navigation-buttons").style.display = "none";
    scoreContainer.style.display = "block";
    scoreContainer.innerHTML = `🎉 You scored <strong>${score}/${total}</strong> (${Math.round((score / total) * 100)}%)`;
  }
});

backBtn.addEventListener("click", () => {
  if (current > 1) {
    current--;
    showQuestion(current);
  }
});

// On load
showQuestion(current);
