(function () {
  const configuredApiBaseUrl = "https://YOUR-RENDER-BACKEND-URL.onrender.com";
  const localApiBaseUrl = window.location.protocol === "file:" ? "http://localhost:3000" : "";
  const apiBaseUrl = (configuredApiBaseUrl.includes("YOUR-RENDER-BACKEND-URL")
    ? localApiBaseUrl
    : configuredApiBaseUrl).replace(/\/+$/, "");

  function apiUrl(path) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${apiBaseUrl}${normalizedPath}`;
  }

  function assetUrl(path) {
    if (!path || /^https?:\/\//i.test(path)) {
      return path;
    }
    return apiUrl(path);
  }

  window.NestoraConfig = {
    apiBaseUrl,
    apiUrl,
    assetUrl
  };
})();
