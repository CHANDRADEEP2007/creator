const stateKey = "smartResumeState";
const steps = [
  "Landing",
  "Country & basics",
  "Experience",
  "Education",
  "Skills & extras",
  "Layout & length",
  "Export & download",
];

const stepElements = Array.from(document.querySelectorAll(".step"));
const stepList = document.getElementById("stepList");
const progressBar = document.getElementById("progressBar");
const currentStepLabel = document.getElementById("currentStepLabel");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const saveExit = document.getElementById("saveExit");
const sampleModal = document.getElementById("sampleModal");
const openSample = document.getElementById("openSample");
const closeSample = document.getElementById("closeSample");
const experienceList = document.getElementById("experienceList");
const educationList = document.getElementById("educationList");
const addExperienceButton = document.getElementById("addExperience");
const addEducationButton = document.getElementById("addEducation");
const skillsInput = document.getElementById("skillsInput");
const skillsChips = document.getElementById("skillsChips");
const sectionOrder = document.getElementById("sectionOrder");
const resumePreview = document.getElementById("resumePreview");
const downloadBtn = document.getElementById("downloadBtn");
const downloadStatus = document.getElementById("downloadStatus");
const editResume = document.getElementById("editResume");
const startOver = document.getElementById("startOver");

const defaultState = {
  currentStep: 0,
  basics: {
    country: "",
    role: "",
    length: "1",
  },
  experience: [],
  education: [],
  skills: [],
  extras: {
    projects: [],
    certifications: [],
    achievements: [],
    toggles: {
      projects: false,
      certifications: false,
      achievements: false,
    },
  },
  layout: {
    fontPreset: "Clean",
    fontSize: "1",
    order: [
      "Experience",
      "Skills",
      "Education",
      "Projects",
      "Certifications",
      "Achievements",
    ],
  },
  export: {
    pdf: true,
    docx: true,
    email: "",
  },
};

const state = loadState();
let previewTimeout;

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

function renderSteps() {
  stepList.innerHTML = "";
  steps.forEach((label, index) => {
    const item = document.createElement("li");
    const number = document.createElement("span");
    number.textContent = index + 1;
    const text = document.createElement("span");
    text.textContent = label;
    item.append(number, text);
    if (index === state.currentStep) {
      item.classList.add("active");
    }
    stepList.appendChild(item);
  });
}

function updateProgress() {
  const percent = Math.round(((state.currentStep + 1) / steps.length) * 100);
  progressBar.style.width = `${percent}%`;
  currentStepLabel.textContent = `${state.currentStep + 1} of ${steps.length}`;
}

function showStep(index) {
  stepElements.forEach((step) => step.classList.remove("active"));
  stepElements[index].classList.add("active");
  state.currentStep = index;
  backBtn.disabled = index === 0;
  nextBtn.textContent = index === 0 ? "Build my resume" : index === steps.length - 1 ? "Finish" : "Next";
  renderSteps();
  updateProgress();
  highlightPreviewSection();
  validateStep();
  saveState();
}

function validateStep() {
  const activeStep = stepElements[state.currentStep];
  if (!activeStep) {
    nextBtn.disabled = false;
    return;
  }

  const requiredFields = Array.from(activeStep.querySelectorAll("[data-required]"));
  let valid = true;

  requiredFields.forEach((field) => {
    const wrapper = field.closest(".field");
    if (!field.value.trim()) {
      valid = false;
      if (wrapper) {
        wrapper.classList.add("error");
        const errorText = wrapper.querySelector(".error-text");
        if (errorText) {
          errorText.textContent = field.dataset.requiredMessage || "This field is required.";
        }
      }
    } else if (wrapper) {
      wrapper.classList.remove("error");
      const errorText = wrapper.querySelector(".error-text");
      if (errorText) {
        errorText.textContent = "";
      }
    }
  });

  nextBtn.disabled = !valid;
}

function debouncePreview() {
  window.clearTimeout(previewTimeout);
  previewTimeout = window.setTimeout(updatePreview, 700);
}

function updatePreview() {
  const previewSections = state.layout.order
    .map((section) => {
      if (section === "Experience") {
        return `
          <div class="preview-section" data-preview="experience">
            <h4>Experience</h4>
            <ul>
              ${state.experience.length
                ? state.experience
                    .map(
                      (item) =>
                        `<li><strong>${escapeHtml(item.title || "Role")}</strong> · ${escapeHtml(
                          item.company || "Company"
                        )}</li>`
                    )
                    .join("")
                : "<li class='muted'>Add roles to preview experience.</li>"}
            </ul>
          </div>
        `;
      }
      if (section === "Skills") {
        return `
          <div class="preview-section" data-preview="skills">
            <h4>Skills</h4>
            <p>${state.skills.length ? state.skills.map(escapeHtml).join(", ") : "Add skills to preview."}</p>
          </div>
        `;
      }
      if (section === "Education") {
        return `
          <div class="preview-section" data-preview="education">
            <h4>Education</h4>
            <ul>
              ${state.education.length
                ? state.education
                    .map(
                      (item) =>
                        `<li><strong>${escapeHtml(item.degree || "Degree")}</strong> · ${escapeHtml(
                          item.school || "School"
                        )}</li>`
                    )
                    .join("")
                : "<li class='muted'>Add education to preview.</li>"}
            </ul>
          </div>
        `;
      }
      const extrasKey = section.toLowerCase();
      const extrasList = state.extras[extrasKey];
      return `
        <div class="preview-section" data-preview="${extrasKey}">
          <h4>${section}</h4>
          <ul>
            ${extrasList.length
              ? extrasList
                  .map(
                    (item) =>
                      `<li><strong>${escapeHtml(item.title || "Title")}</strong> · ${escapeHtml(
                        item.org || "Organization"
                      )}</li>`
                  )
                  .join("")
              : "<li class='muted'>Add items to preview.</li>"}
          </ul>
        </div>
      `;
    })
    .join("");

  const lengthLabel = state.basics.length === "1" ? "1 page" : "2 pages";
  const fontSize = state.basics.length === "1" ? "10.5pt" : "11pt";
  resumePreview.innerHTML = `
    <div class="preview-section" data-preview="header">
      <h3>${escapeHtml(state.basics.role || "Your target role")}</h3>
      <p class="muted">${escapeHtml(state.basics.country || "Target country")}</p>
      <p class="muted">${escapeHtml(state.layout.fontPreset)} preset · ${lengthLabel}</p>
    </div>
    ${previewSections}
    <div class="preview-page-break">Page 1 end</div>
    <p class="muted">Your content currently fits in ${lengthLabel} with ${fontSize} font.</p>
  `;
  highlightPreviewSection();
}

function highlightPreviewSection() {
  const map = {
    2: "experience",
    3: "education",
    4: "skills",
    5: "header",
  };
  resumePreview.querySelectorAll(".preview-section").forEach((section) => {
    section.classList.remove("highlight");
  });
  const key = map[state.currentStep];
  if (key) {
    const target = resumePreview.querySelector(`[data-preview='${key}']`);
    if (target) {
      target.classList.add("highlight");
    }
  }
}

function createExperienceCard(data = {}) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-header">
      <div>
        <strong class="card-title">${escapeHtml(data.company || "New role")}</strong>
        <p class="card-meta">${escapeHtml(data.title || "Job title")}</p>
      </div>
      <button type="button" class="ghost" data-toggle>Collapse</button>
    </div>
    <div class="card-body">
      <div class="grid">
        <label class="field">
          Company name
          <input type="text" name="company" value="${escapeHtml(data.company || "")}" data-required data-required-message="Company name is required." />
          <span class="error-text"></span>
        </label>
        <label class="field">
          Job title
          <input type="text" name="title" value="${escapeHtml(data.title || "")}" data-required data-required-message="Job title is required." />
          <span class="error-text"></span>
        </label>
        <label class="field">
          Location
          <input type="text" name="location" value="${escapeHtml(data.location || "")}" placeholder="City, Country" />
        </label>
        <label class="field">
          Start date
          <input type="month" name="start" value="${escapeHtml(data.start || "")}" data-required data-required-message="Start date is required." />
          <span class="error-text"></span>
        </label>
        <label class="field">
          End date
          <input type="month" name="end" value="${escapeHtml(data.end || "")}" />
          <span class="error-text"></span>
        </label>
        <label class="field toggle">
          <input type="checkbox" name="current" ${data.current ? "checked" : ""} />
          Present
        </label>
      </div>
      <label class="field">
        Description (bullets)
        <textarea name="description" rows="3">${escapeHtml(data.description || "")}</textarea>
      </label>
      <button type="button" class="secondary" data-remove>Remove role</button>
    </div>
  `;

  const toggleButton = card.querySelector("[data-toggle]");
  toggleButton.addEventListener("click", () => {
    card.classList.toggle("collapsed");
    toggleButton.textContent = card.classList.contains("collapsed") ? "Expand" : "Collapse";
  });

  card.querySelector("[data-remove]").addEventListener("click", () => {
    card.remove();
    syncExperience();
  });

  const inputs = Array.from(card.querySelectorAll("input, textarea"));
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      syncExperience();
      validateStep();
      debouncePreview();
    });
    input.addEventListener("blur", updatePreview);
  });

  const currentToggle = card.querySelector("input[name='current']");
  const endInput = card.querySelector("input[name='end']");
  endInput.disabled = currentToggle.checked;
  currentToggle.addEventListener("change", () => {
    endInput.disabled = currentToggle.checked;
    if (currentToggle.checked) {
      endInput.value = "";
    }
    syncExperience();
  });

  return card;
}

function createEducationCard(data = {}) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-header">
      <div>
        <strong class="card-title">${escapeHtml(data.school || "New school")}</strong>
        <p class="card-meta">${escapeHtml(data.degree || "Degree")}</p>
      </div>
      <button type="button" class="ghost" data-toggle>Collapse</button>
    </div>
    <div class="card-body">
      <div class="grid">
        <label class="field">
          School
          <input type="text" name="school" value="${escapeHtml(data.school || "")}" data-required data-required-message="School is required." />
          <span class="error-text"></span>
        </label>
        <label class="field">
          Degree
          <input type="text" name="degree" value="${escapeHtml(data.degree || "")}" data-required data-required-message="Degree is required." />
          <span class="error-text"></span>
        </label>
        <label class="field">
          Field of study
          <input type="text" name="field" value="${escapeHtml(data.field || "")}" />
        </label>
        <label class="field">
          Location
          <input type="text" name="location" value="${escapeHtml(data.location || "")}" />
        </label>
        <label class="field">
          Start date
          <input type="month" name="start" value="${escapeHtml(data.start || "")}" />
        </label>
        <label class="field">
          End date
          <input type="month" name="end" value="${escapeHtml(data.end || "")}" />
          <span class="error-text"></span>
        </label>
        <label class="field">
          GPA (optional)
          <input type="text" name="gpa" value="${escapeHtml(data.gpa || "")}" />
        </label>
      </div>
      <button type="button" class="secondary" data-remove>Remove education</button>
    </div>
  `;

  const toggleButton = card.querySelector("[data-toggle]");
  toggleButton.addEventListener("click", () => {
    card.classList.toggle("collapsed");
    toggleButton.textContent = card.classList.contains("collapsed") ? "Expand" : "Collapse";
  });

  card.querySelector("[data-remove]").addEventListener("click", () => {
    card.remove();
    syncEducation();
  });

  const inputs = Array.from(card.querySelectorAll("input"));
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      syncEducation();
      validateStep();
      debouncePreview();
    });
    input.addEventListener("blur", updatePreview);
  });

  return card;
}

function syncExperience() {
  const entries = Array.from(experienceList.querySelectorAll(".card"));
  state.experience = entries.map((card) => {
    const data = {
      company: card.querySelector("input[name='company']").value,
      title: card.querySelector("input[name='title']").value,
      location: card.querySelector("input[name='location']").value,
      start: card.querySelector("input[name='start']").value,
      end: card.querySelector("input[name='end']").value,
      current: card.querySelector("input[name='current']").checked,
      description: card.querySelector("textarea[name='description']").value,
    };
    updateCardHeader(card, data.company, data.title);
    validateDates(card, data.start, data.end, data.current);
    return data;
  });
  saveState();
  updatePreview();
}

function syncEducation() {
  const entries = Array.from(educationList.querySelectorAll(".card"));
  state.education = entries.map((card) => {
    const data = {
      school: card.querySelector("input[name='school']").value,
      degree: card.querySelector("input[name='degree']").value,
      field: card.querySelector("input[name='field']").value,
      location: card.querySelector("input[name='location']").value,
      start: card.querySelector("input[name='start']").value,
      end: card.querySelector("input[name='end']").value,
      gpa: card.querySelector("input[name='gpa']").value,
    };
    updateCardHeader(card, data.school, data.degree);
    validateDates(card, data.start, data.end, false);
    return data;
  });
  saveState();
  updatePreview();
}

function updateCardHeader(card, title, subtitle) {
  card.querySelector(".card-title").textContent = title || "New entry";
  card.querySelector(".card-meta").textContent = subtitle || "Details pending";
}

function validateDates(card, start, end, isCurrent) {
  const endField = card.querySelector("input[name='end']");
  const endWrapper = endField.closest(".field");
  const errorText = endWrapper.querySelector(".error-text");
  if (!start || !end || isCurrent) {
    endWrapper.classList.remove("error");
    if (errorText) {
      errorText.textContent = "";
    }
    return true;
  }
  if (end < start) {
    endWrapper.classList.add("error");
    if (errorText) {
      errorText.textContent = "End date must be after start date.";
    }
    return false;
  }
  endWrapper.classList.remove("error");
  if (errorText) {
    errorText.textContent = "";
  }
  return true;
}

function bindBasics() {
  const country = document.getElementById("targetCountry");
  const role = document.getElementById("targetRole");
  const lengthRadios = document.querySelectorAll("input[name='resumeLength']");

  country.value = state.basics.country;
  role.value = state.basics.role;
  lengthRadios.forEach((radio) => {
    radio.checked = radio.value === state.basics.length;
  });

  country.addEventListener("input", (event) => {
    state.basics.country = event.target.value;
    validateStep();
    debouncePreview();
    saveState();
  });
  role.addEventListener("input", (event) => {
    state.basics.role = event.target.value;
    validateStep();
    debouncePreview();
    saveState();
  });
  lengthRadios.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      state.basics.length = event.target.value;
      updatePreview();
      saveState();
    });
  });
}

function bindSkills() {
  skillsInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const value = skillsInput.value.trim();
      if (value) {
        addSkill(value);
      }
    }
  });

  document.querySelectorAll("[data-suggestion]").forEach((button) => {
    button.addEventListener("click", () => addSkill(button.dataset.suggestion));
  });
}

function addSkill(value) {
  if (!state.skills.includes(value)) {
    state.skills.push(value);
    renderSkills();
    saveState();
    updatePreview();
  }
  skillsInput.value = "";
}

function renderSkills() {
  skillsChips.innerHTML = "";
  state.skills.forEach((skill) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = skill;
    chip.addEventListener("click", () => {
      state.skills = state.skills.filter((item) => item !== skill);
      renderSkills();
      updatePreview();
      saveState();
    });
    skillsChips.appendChild(chip);
  });
}

function bindExtras() {
  const mappings = [
    { toggle: "toggleProjects", section: "projectsSection", key: "projects" },
    { toggle: "toggleCertifications", section: "certificationsSection", key: "certifications" },
    { toggle: "toggleAchievements", section: "achievementsSection", key: "achievements" },
  ];

  mappings.forEach(({ toggle, section, key }) => {
    const toggleInput = document.getElementById(toggle);
    const sectionElement = document.getElementById(section);
    toggleInput.checked = state.extras.toggles[key];
    sectionElement.classList.toggle("active", toggleInput.checked);
    toggleInput.addEventListener("change", () => {
      state.extras.toggles[key] = toggleInput.checked;
      sectionElement.classList.toggle("active", toggleInput.checked);
      saveState();
    });
  });

  document.querySelectorAll("[data-add-extra]").forEach((button) => {
    button.addEventListener("click", () => {
      addExtraCard(button.dataset.addExtra);
    });
  });
}

function addExtraCard(type, data = {}) {
  const list = document.querySelector(`[data-extra-list='${type}']`);
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="grid">
      <label class="field">
        Title
        <input type="text" name="title" value="${escapeHtml(data.title || "")}" />
      </label>
      <label class="field">
        Organization
        <input type="text" name="org" value="${escapeHtml(data.org || "")}" />
      </label>
      <label class="field">
        Year
        <input type="text" name="year" value="${escapeHtml(data.year || "")}" placeholder="2024" />
      </label>
    </div>
    <label class="field">
      Short description
      <textarea name="description" rows="2">${escapeHtml(data.description || "")}</textarea>
    </label>
    <button type="button" class="secondary" data-remove>Remove</button>
  `;
  card.querySelector("[data-remove]").addEventListener("click", () => {
    card.remove();
    syncExtras(type);
  });
  card.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", () => {
      syncExtras(type);
      debouncePreview();
    });
  });
  list.appendChild(card);
  syncExtras(type);
}

function syncExtras(type) {
  const list = document.querySelector(`[data-extra-list='${type}']`);
  state.extras[type] = Array.from(list.querySelectorAll(".card")).map((card) => ({
    title: card.querySelector("input[name='title']").value,
    org: card.querySelector("input[name='org']").value,
    year: card.querySelector("input[name='year']").value,
    description: card.querySelector("textarea[name='description']").value,
  }));
  saveState();
  updatePreview();
}

function bindLayout() {
  document.querySelectorAll("input[name='fontPreset']").forEach((radio) => {
    radio.checked = radio.value === state.layout.fontPreset;
    radio.addEventListener("change", (event) => {
      state.layout.fontPreset = event.target.value;
      updatePreview();
      saveState();
    });
  });
  document.querySelectorAll("input[name='fontSize']").forEach((radio) => {
    radio.checked = radio.value === state.layout.fontSize;
    radio.addEventListener("change", (event) => {
      state.layout.fontSize = event.target.value;
      updatePreview();
      saveState();
    });
  });

  renderSectionOrder();

  document.querySelectorAll("[data-preview-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("[data-preview-tab]").forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");
      const showPreview = tab.dataset.previewTab === "preview";
      resumePreview.classList.toggle("hide-on-mobile", !showPreview);
    });
  });

  resumePreview.classList.add("hide-on-mobile");
}

function renderSectionOrder() {
  sectionOrder.innerHTML = "";
  state.layout.order.forEach((item) => {
    const li = document.createElement("li");
    li.className = "order-item";
    li.draggable = true;
    li.textContent = item;
    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragover", handleDragOver);
    li.addEventListener("drop", handleDrop);
    sectionOrder.appendChild(li);
  });
}

let dragItem = null;
function handleDragStart(event) {
  dragItem = event.target;
  event.dataTransfer.effectAllowed = "move";
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function handleDrop(event) {
  event.preventDefault();
  if (!dragItem || dragItem === event.target) {
    return;
  }
  const items = Array.from(sectionOrder.children);
  const fromIndex = items.indexOf(dragItem);
  const toIndex = items.indexOf(event.target);
  items.splice(toIndex, 0, items.splice(fromIndex, 1)[0]);
  state.layout.order = items.map((item) => item.textContent);
  renderSectionOrder();
  updatePreview();
  saveState();
}

function bindExport() {
  const pdfCheckbox = document.querySelector("input[name='formatPdf']");
  const docxCheckbox = document.querySelector("input[name='formatDocx']");
  const emailInput = document.getElementById("emailCopy");

  pdfCheckbox.checked = state.export.pdf;
  docxCheckbox.checked = state.export.docx;
  emailInput.value = state.export.email;

  pdfCheckbox.addEventListener("change", () => {
    state.export.pdf = pdfCheckbox.checked;
    saveState();
  });
  docxCheckbox.addEventListener("change", () => {
    state.export.docx = docxCheckbox.checked;
    saveState();
  });
  emailInput.addEventListener("input", (event) => {
    state.export.email = event.target.value;
    saveState();
  });

  downloadBtn.addEventListener("click", () => {
    downloadBtn.disabled = true;
    downloadBtn.textContent = "Building your resume layout…";
    downloadStatus.textContent = "Building your resume layout…";
    window.setTimeout(() => {
      downloadBtn.disabled = false;
      downloadBtn.textContent = "Download resume";
      downloadStatus.textContent = "Your files are ready to download.";
    }, 1200);
  });

  editResume.addEventListener("click", () => showStep(1));
  startOver.addEventListener("click", () => {
    localStorage.removeItem(stateKey);
    window.location.reload();
  });
}

function bindNavigation() {
  nextBtn.addEventListener("click", () => {
    if (state.currentStep < steps.length - 1) {
      showStep(state.currentStep + 1);
    }
  });
  backBtn.addEventListener("click", () => {
    if (state.currentStep > 0) {
      showStep(state.currentStep - 1);
    }
  });
  saveExit.addEventListener("click", () => {
    saveState();
    downloadStatus.textContent = "Draft saved to this device.";
  });
}

function bindModal() {
  openSample.addEventListener("click", () => {
    sampleModal.classList.add("active");
    sampleModal.setAttribute("aria-hidden", "false");
  });
  closeSample.addEventListener("click", () => {
    sampleModal.classList.remove("active");
    sampleModal.setAttribute("aria-hidden", "true");
  });
  sampleModal.addEventListener("click", (event) => {
    if (event.target === sampleModal) {
      sampleModal.classList.remove("active");
      sampleModal.setAttribute("aria-hidden", "true");
    }
  });
}

function hydrateEntries() {
  experienceList.innerHTML = "";
  if (state.experience.length === 0) {
    experienceList.appendChild(createExperienceCard());
  } else {
    state.experience.forEach((entry) => experienceList.appendChild(createExperienceCard(entry)));
  }

  educationList.innerHTML = "";
  if (state.education.length === 0) {
    educationList.appendChild(createEducationCard());
  } else {
    state.education.forEach((entry) => educationList.appendChild(createEducationCard(entry)));
  }

  ["projects", "certifications", "achievements"].forEach((key) => {
    const list = document.querySelector(`[data-extra-list='${key}']`);
    list.innerHTML = "";
    state.extras[key].forEach((item) => addExtraCard(key, item));
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

addExperienceButton.addEventListener("click", () => {
  experienceList.appendChild(createExperienceCard());
});

addEducationButton.addEventListener("click", () => {
  educationList.appendChild(createEducationCard());
});

bindBasics();
bindSkills();
bindExtras();
bindLayout();
bindExport();
bindNavigation();
bindModal();
renderSkills();
hydrateEntries();
renderSteps();
updatePreview();
showStep(state.currentStep || 0);
