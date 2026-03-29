import axiosInstance from "./axios";

/**
 * Creates a good return document from an outbound document.
 * 
 * @param {Object} data - Return document data
 * @param {string} data.outboundDocumentNumber - Number of the original outbound document
 * @param {string} data.comment - Optional comment
 * @param {Array} data.goods - List of returned goods
 * @param {string} data.goods[].barcode - Barcode of the product
 * @param {number} data.goods[].quantity - Quantity to return
 */
export const createGoodReturnDocument = async (data) => {
  const response = await axiosInstance.post("/good-return-documents", data);
  return response.data;
};
