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

    if (!response.ok) {
      throw new Error(data.msg || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return { success: false, msg: error.message };
  }
};
