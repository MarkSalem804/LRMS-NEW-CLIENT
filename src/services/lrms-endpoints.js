/* eslint-disable no-unused-vars */
import axios from "axios";

const customError = new Error("Network error or no response");
const BASE_URL = "http://localhost:5001";

// Function to upload material metadata (Excel file)
export const uploadMaterialsMetadata = async (excelFile) => {
  const formData = new FormData();
  formData.append("excelFile", excelFile); // 'excelFile' should match the server's upload field name

  try {
    const response = await axios.post(
      `${BASE_URL}/lrms/upload-materials`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading material metadata:", error);
    throw error.response?.data || customError;
  }
};

// Function to upload a specific material file
export const uploadMaterialFile = async (materialId, materialFile) => {
  const formData = new FormData();
  formData.append("materialFile", materialFile); // 'materialFile' should match the server's upload field name

  try {
    const response = await axios.post(
      `${BASE_URL}/lrms/upload-material-file/${materialId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error uploading material file for ID ${materialId}:`, error);
    throw error.response?.data || customError;
  }
};

// Function to fetch all materials
export const getAllMaterials = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/lrms/getAllMaterials`);
    return response.data;
  } catch (error) {
    console.error("Error fetching materials:", error);
    throw error.response?.data || customError;
  }
};
