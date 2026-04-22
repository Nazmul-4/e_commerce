export const saveSelectedJobId = (jobId) => {
  localStorage.setItem("selectedJobId", jobId);
};

export const getSelectedJobId = () => {
  return localStorage.getItem("selectedJobId") || "";
};

export const clearSelectedJobId = () => {
  localStorage.removeItem("selectedJobId");
};