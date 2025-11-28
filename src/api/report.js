import axiosInstance from "./axios";

export const downloadLeftoverReport = async () => {
  const response = await axiosInstance.get("/report/leftover", {
    responseType: "blob", // must be blob for PDF
  });

  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "leftover_report.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadTransactionsReport = async () => {
  const response = await axiosInstance.get("/report/transactions", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "transactions_report.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
