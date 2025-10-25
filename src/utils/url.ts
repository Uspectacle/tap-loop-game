export const copyURL = async () => {
  const url = new URL(window.location.href);

  try {
    await navigator.clipboard.writeText(url.toString());
    alert("URL copied to clipboard!");
  } catch {
    alert("Failed to copy URL.");
  }
};
