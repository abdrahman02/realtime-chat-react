export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return { success: false, msg: error.message };
  }
};

export const getRequest = async (url) => {
  try {
    const response = await fetch(url);

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return { success: false, msg: error.message };
  }
};
