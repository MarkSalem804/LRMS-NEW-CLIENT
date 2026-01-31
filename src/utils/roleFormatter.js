/**
 * Formats role enum values to display-friendly names
 * @param {string} role - The role enum value
 * @returns {string} - The formatted display name
 */
export function formatRoleDisplay(role) {
  if (!role) return "N/A";

  const roleMap = {
    Administrative: "Administrator",
    Teacher: "Teacher",
    EPS: "Education Program Supervisor",
    LR_coor: "Learning Resource Coordinator",
    Non_teaching: "Non-teaching",
  };

  return roleMap[role] || role;
}
