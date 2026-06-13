document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const form = document.getElementById("addPropertyForm");

  // Redirect to login if no owner session (only for add-property.html)
  if (form) {
    const ownerSession = localStorage.getItem("ownerSession");
    if (!ownerSession) {
      window.location.href = "login.html";
      return;
    }
    
    // Pre-fill owner email from session and make it read-only
    const emailInput = document.querySelector("input[name='email']");
    if (emailInput) {
      const parsedSession = JSON.parse(ownerSession);
      emailInput.value = parsedSession.email || "";
      emailInput.readOnly = true;
    }
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      siteNav.classList.toggle("nav-open");
    });
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const ownerSession = JSON.parse(localStorage.getItem("ownerSession") || "{}");

      if (ownerSession.email) {
        formData.set("ownerEmail", ownerSession.email);
        formData.set("email", formData.get("email") || ownerSession.email);
      }

      try {
        const response = await fetch(window.NestoraConfig.apiUrl("/api/properties"), {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          throw new Error("Failed to submit property");
        }

        alert("Property added successfully.");
        form.reset();
        window.location.href = "owner-dashboard.html";
      } catch (error) {
        console.error(error);
        alert("Unable to add property.");
      }
    });
  }
});
