const stateKey = "resumeMagicState";
const stepList = document.getElementById("stepList");
const steps = [
  "Market Selection",
  "Quick Profile",
  "Experience",
  "Education",
  "Skills",
  "Resume Settings",
  "Preview & Download",
];

const stepElements = Array.from(document.querySelectorAll(".form-step"));
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const progressSummary = document.getElementById("progressSummary");
const progressBar = document.getElementById("progressBar");
const resumePreview = document.getElementById("resumePreview");
const atsSummary = document.getElementById("atsSummary");
const resumeLength = document.getElementById("resumeLength");
const jobCount = document.getElementById("jobCount");
const skillsCount = document.getElementById("skillsCount");
const heroScore = document.getElementById("heroScore");
const atsScoreLarge = document.getElementById("atsScoreLarge");
const atsStatus = document.getElementById("atsStatus");
const previewLength = document.getElementById("previewLength");
const previewJobs = document.getElementById("previewJobs");
const previewSkills = document.getElementById("previewSkills");
const marketNotes = document.getElementById("marketNotes");
const countrySearchInput = document.getElementById("countrySearch");
const countryOptions = document.getElementById("countryOptions");

const addExperienceButton = document.getElementById("addExperience");
const addEducationButton = document.getElementById("addEducation");
const experienceList = document.getElementById("experienceList");
const educationList = document.getElementById("educationList");

const defaultState = {
  currentStep: 0,
  profile: {
    currentJobTitle: "",
    yearsOfExperience: "",
    targetIndustry: "",
    isRecentGraduate: false,
  },
  targetCountries: [],
  experience: [],
  education: [],
  skills: {
    technical: "",
    soft: "",
    certifications: "",
    languages: "",
  },
  settings: {
    pageLength: "1",
    template: "ats",
    exportFormat: "both",
  },
};

const state = loadState();

function loadState() {
  const stored = localStorage.getItem(stateKey);
  if (!stored) {
    return structuredClone(defaultState);
  }
  try {
    return { ...structuredClone(defaultState), ...JSON.parse(stored) };
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(stateKey, JSON.stringify(state));
}

function updateProgress() {
  const completed = stepElements.reduce((count, step, index) => {
    if (index < state.currentStep) {
      return count + 1;
    }
    return count;
  }, 0);
  const percent = Math.round((completed / (steps.length - 1)) * 100);
  progressSummary.textContent = `${percent}% complete`;
  progressBar.style.width = `${percent}%`;
}

function renderSteps() {
  stepList.innerHTML = "";
  steps.forEach((label, index) => {
    const item = document.createElement("li");
    item.textContent = label;
    if (index === state.currentStep) {
      item.classList.add("active");
    }
    stepList.appendChild(item);
  });
}

function showStep(index) {
  stepElements.forEach((step) => step.classList.remove("active"));
  const active = stepElements[index];
  if (active) {
    active.classList.add("active");
  }
  state.currentStep = index;
  backBtn.disabled = index === 0;
  nextBtn.textContent = index === stepElements.length - 1 ? "Finish" : "Next";
  renderSteps();
  updateProgress();
  updatePreview();
  saveState();
}

function createExperienceEntry(data = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "entry-card";
  wrapper.innerHTML = `
    <h4>Job entry</h4>
    <div class="grid">
      <label class="field">
        Company name
        <input type="text" name="company" value="${data.company || ""}" placeholder="Company" />
      </label>
      <label class="field">
        Job title
        <input type="text" name="title" value="${data.title || ""}" placeholder="Software Engineer" />
      </label>
      <label class="field">
        Start date
        <input type="month" name="start" value="${data.start || ""}" />
      </label>
      <label class="field">
        End date
        <input type="month" name="end" value="${data.end || ""}" />
      </label>
    </div>
    <label class="field">
      Key achievements
      <textarea name="achievements" rows="3" placeholder="Led...">${
        data.achievements || ""
      }</textarea>
    </label>
    <div class="entry-actions">
      <button type="button" class="secondary" data-action="remove">Remove</button>
    </div>
  `;

  wrapper.querySelector("[data-action='remove']").addEventListener("click", () => {
    wrapper.remove();
    syncExperience();
  });

  wrapper.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", syncExperience);
  });

  return wrapper;
}

function createEducationEntry(data = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "entry-card";
  wrapper.innerHTML = `
    <h4>Education entry</h4>
    <div class="grid">
      <label class="field">
        Institution
        <input type="text" name="institution" value="${
          data.institution || ""
        }" placeholder="University" />
      </label>
      <label class="field">
        Degree
        <input type="text" name="degree" value="${
          data.degree || ""
        }" placeholder="Bachelors" />
      </label>
      <label class="field">
        Field of study
        <input type="text" name="field" value="${
          data.field || ""
        }" placeholder="Computer Science" />
      </label>
      <label class="field">
        Graduation date
        <input type="month" name="graduation" value="${
          data.graduation || ""
        }" />
      </label>
    </div>
    <label class="field">
      Honors / coursework
      <textarea name="honors" rows="2" placeholder="Dean's List">${
        data.honors || ""
      }</textarea>
    </label>
    <div class="entry-actions">
      <button type="button" class="secondary" data-action="remove">Remove</button>
    </div>
  `;

  wrapper.querySelector("[data-action='remove']").addEventListener("click", () => {
    wrapper.remove();
    syncEducation();
  });

  wrapper.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", syncEducation);
  });

  return wrapper;
}

function syncExperience() {
  const entries = Array.from(experienceList.querySelectorAll(".entry-card"));
  state.experience = entries.map((entry) => ({
    company: entry.querySelector("input[name='company']").value,
    title: entry.querySelector("input[name='title']").value,
    start: entry.querySelector("input[name='start']").value,
    end: entry.querySelector("input[name='end']").value,
    achievements: entry.querySelector("textarea[name='achievements']").value,
  }));
  updatePreview();
  saveState();
}

function syncEducation() {
  const entries = Array.from(educationList.querySelectorAll(".entry-card"));
  state.education = entries.map((entry) => ({
    institution: entry.querySelector("input[name='institution']").value,
    degree: entry.querySelector("input[name='degree']").value,
    field: entry.querySelector("input[name='field']").value,
    graduation: entry.querySelector("input[name='graduation']").value,
    honors: entry.querySelector("textarea[name='honors']").value,
  }));
  updatePreview();
  saveState();
}

function bindFormFields() {
  document
    .querySelector("input[name='currentJobTitle']")
    .addEventListener("input", (event) => {
      state.profile.currentJobTitle = event.target.value;
      updatePreview();
      saveState();
    });

  document
    .querySelector("input[name='yearsOfExperience']")
    .addEventListener("input", (event) => {
      state.profile.yearsOfExperience = event.target.value;
      updatePreview();
      saveState();
    });

  document
    .querySelector("input[name='targetIndustry']")
    .addEventListener("input", (event) => {
      state.profile.targetIndustry = event.target.value;
      updatePreview();
      saveState();
    });

  document
    .querySelector("input[name='isRecentGraduate']")
    .addEventListener("change", (event) => {
      state.profile.isRecentGraduate = event.target.checked;
      updatePreview();
      saveState();
    });

  document.querySelectorAll("input[name='targetCountries']").forEach((input) => {
    input.addEventListener("change", () => {
      const selected = Array.from(
        document.querySelectorAll("input[name='targetCountries']:checked")
      ).map((item) => item.value);
      state.targetCountries = selected;
      updatePreview();
      saveState();
    });
  });

  document
    .querySelector("input[name='technicalSkills']")
    .addEventListener("input", (event) => {
      state.skills.technical = event.target.value;
      updatePreview();
      saveState();
    });

  document
    .querySelector("input[name='softSkills']")
    .addEventListener("input", (event) => {
      state.skills.soft = event.target.value;
      updatePreview();
      saveState();
    });

  document
    .querySelector("input[name='certifications']")
    .addEventListener("input", (event) => {
      state.skills.certifications = event.target.value;
      updatePreview();
      saveState();
    });

  document
    .querySelector("input[name='languages']")
    .addEventListener("input", (event) => {
      state.skills.languages = event.target.value;
      updatePreview();
      saveState();
    });

  document.querySelectorAll("input[name='pageLength']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.settings.pageLength = event.target.value;
      updatePreview();
      saveState();
    });
  });

  document.querySelectorAll("input[name='template']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.settings.template = event.target.value;
      updatePreview();
      saveState();
    });
  });

  document.querySelectorAll("input[name='exportFormat']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.settings.exportFormat = event.target.value;
      updatePreview();
      saveState();
    });
  });

  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      applyPreset(button.dataset.preset);
      updatePreview();
      saveState();
    });
  });

  countrySearchInput.addEventListener("input", (event) => {
    filterCountries(event.target.value);
  });
}

function updatePreview() {
  resumeLength.textContent = `${state.settings.pageLength} page${
    state.settings.pageLength === "1" ? "" : "s"
  }`;
  previewLength.textContent = resumeLength.textContent;

  const jobs = state.experience.filter((entry) => entry.company || entry.title);
  const skills = [
    state.skills.technical,
    state.skills.soft,
    state.skills.certifications,
    state.skills.languages,
  ]
    .join(",")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  jobCount.textContent = jobs.length;
  skillsCount.textContent = skills.length;
  previewJobs.textContent = `${jobs.length} job${jobs.length === 1 ? "" : "s"}`;
  previewSkills.textContent = `${skills.length} skill${skills.length === 1 ? "" : "s"}`;

  const atsScore = calculateAtsScore(jobs.length, state.education.length, skills.length);
  atsSummary.textContent = `ATS score: ${atsScore}/100 · ${
    atsScore >= 80 ? "Ready to submit" : "Add more detail to improve"
  }`;
  heroScore.textContent = atsScore;
  atsScoreLarge.textContent = atsScore;
  atsStatus.textContent =
    atsScore >= 80
      ? "Parsing test passed."
      : "Add more experience, education, or skills.";

  const countryLabel = state.targetCountries.length
    ? state.targetCountries.join(", ")
    : "No markets selected";

  resumePreview.innerHTML = `
    <h4>${state.profile.currentJobTitle || "Your Job Title"}</h4>
    <p><strong>Target Markets:</strong> ${countryLabel}</p>
    <p><strong>Experience:</strong> ${jobs.length} roles captured</p>
    <p><strong>Education:</strong> ${state.education.length} entries</p>
    <p><strong>Skills:</strong> ${skills.join(", ") || "Add skills to enhance ATS"}</p>
    <p><strong>Template:</strong> ${state.settings.template}</p>
    <p><strong>Export:</strong> ${formatExportLabel(state.settings.exportFormat)}</p>
  `;

  marketNotes.textContent = buildMarketNotes(state.targetCountries);
}

function calculateAtsScore(jobCountValue, educationCount, skillsTotal) {
  let score = 60;
  if (jobCountValue > 0) {
    score += 10;
  }
  if (educationCount > 0) {
    score += 10;
  }
  if (skillsTotal >= 3) {
    score += 10;
  }
  if (state.profile.currentJobTitle) {
    score += 5;
  }
  if (state.targetCountries.length > 0) {
    score += 5;
  }
  return Math.min(score, 100);
}

function applyPreset(preset) {
  const presets = {
    english: ["United States", "United Kingdom", "Canada", "Australia"],
    tech: ["United States", "India", "Germany", "Canada"],
    eu: ["Germany", "France", "United Kingdom"],
  };

  const selected = presets[preset] || [];
  document.querySelectorAll("input[name='targetCountries']").forEach((input) => {
    input.checked = selected.includes(input.value);
  });
  state.targetCountries = selected;
}

function filterCountries(query) {
  const normalized = query.trim().toLowerCase();
  const labels = Array.from(countryOptions.querySelectorAll(".pill"));
  labels.forEach((label) => {
    const text = label.textContent.trim().toLowerCase();
    label.style.display = text.includes(normalized) ? "flex" : "none";
  });
}

function buildMarketNotes(selectedCountries) {
  if (!selectedCountries.length) {
    return "Select markets to see formatting guidance.";
  }

  if (selectedCountries.includes("United States")) {
    return "US resumes highlight quantified impact and recent achievements.";
  }
  if (selectedCountries.includes("Germany") || selectedCountries.includes("France")) {
    return "EU resumes emphasize certifications, dates, and optional personal details.";
  }
  if (selectedCountries.includes("India")) {
    return "India resumes elevate education, GPA, and certifications.";
  }
  return "Mix market conventions by balancing achievements with formal credentials.";
}

function formatExportLabel(format) {
  if (format === "both") {
    return "PDF + DOCX";
  }
  return format.toUpperCase();
}

function hydrateForm() {
  document.querySelector("input[name='currentJobTitle']").value =
    state.profile.currentJobTitle;
  document.querySelector("input[name='yearsOfExperience']").value =
    state.profile.yearsOfExperience;
  document.querySelector("input[name='targetIndustry']").value =
    state.profile.targetIndustry;
  document.querySelector("input[name='isRecentGraduate']").checked =
    state.profile.isRecentGraduate;

  document.querySelectorAll("input[name='targetCountries']").forEach((input) => {
    input.checked = state.targetCountries.includes(input.value);
  });

  document.querySelector("input[name='technicalSkills']").value = state.skills.technical;
  document.querySelector("input[name='softSkills']").value = state.skills.soft;
  document.querySelector("input[name='certifications']").value =
    state.skills.certifications;
  document.querySelector("input[name='languages']").value = state.skills.languages;

  document.querySelector(
    `input[name='pageLength'][value='${state.settings.pageLength}']`
  ).checked = true;
  document.querySelector(
    `input[name='template'][value='${state.settings.template}']`
  ).checked = true;
  document.querySelector(
    `input[name='exportFormat'][value='${state.settings.exportFormat}']`
  ).checked = true;

  experienceList.innerHTML = "";
  if (state.experience.length === 0) {
    experienceList.appendChild(createExperienceEntry());
  } else {
    state.experience.forEach((entry) => {
      experienceList.appendChild(createExperienceEntry(entry));
    });
  }

  educationList.innerHTML = "";
  if (state.education.length === 0) {
    educationList.appendChild(createEducationEntry());
  } else {
    state.education.forEach((entry) => {
      educationList.appendChild(createEducationEntry(entry));
    });
  }
}

addExperienceButton.addEventListener("click", () => {
  experienceList.appendChild(createExperienceEntry());
});

addEducationButton.addEventListener("click", () => {
  educationList.appendChild(createEducationEntry());
});

nextBtn.addEventListener("click", () => {
  if (state.currentStep < stepElements.length - 1) {
    showStep(state.currentStep + 1);
  } else {
    showStep(0);
  }
});

backBtn.addEventListener("click", () => {
  if (state.currentStep > 0) {
    showStep(state.currentStep - 1);
  }
});

hydrateForm();
bindFormFields();
showStep(state.currentStep || 0);
