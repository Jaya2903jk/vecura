export const mapMenuItemRoute = (page = "") => {
  if (!page) return "/dashboard";

  const clean = page.toLowerCase().trim();

  // Ticket system

  if (clean.includes("ticket") && clean.includes("add")) return "/ticket/add";
  if (clean.includes("ticket") && clean.includes("view")) return "/ticket/view";
  if (clean.includes("ticket")) return "/ticket";

  // Customer
  if (clean.includes("customer") && clean.includes("add")) return "/customer/add";
  if (clean.includes("customer")) return "/customer";

  // Appointment
  if (clean.includes("appointment")) return "/appointments";

  return "/dashboard";
};
