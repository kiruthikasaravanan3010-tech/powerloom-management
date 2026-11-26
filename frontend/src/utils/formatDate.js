export const formatDate = (dateValue) => {
  if (!dateValue) return "-";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  let dateFormat = "DD/MM/YYYY";

  try {
    const savedSettings = localStorage.getItem("powerloomSettings");

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      dateFormat = settings.dateFormat || "DD/MM/YYYY";
    }
  } catch (error) {
    console.error("Unable to load date format:", error);
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  switch (dateFormat) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;

    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;

    case "DD/MM/YYYY":
    default:
      return `${day}/${month}/${year}`;
  }
};