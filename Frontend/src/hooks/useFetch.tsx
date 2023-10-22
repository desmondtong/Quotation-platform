import { useFetchType, data, returnValue } from "../interfaces";

const useFetch = () => {
  const fetchData: useFetchType = async (endpoint, method, body, token) => {
    const path = import.meta.env.VITE_SERVER + endpoint;

    const res = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });

    const data: data = await res.json();

    let returnValue: returnValue;
    if (res.ok) {
      if (data.status === "error") {
        returnValue = { ok: false, data: data.msg };
      } else {
        returnValue = { ok: true, data };
      }
    } else {
      if (data?.errors && Array.isArray(data.errors)) {
        const messages = data.errors.map((item) => item.msg);
        returnValue = { ok: false, data: messages };
      } else if (data?.status === "error") {
        returnValue = { ok: false, data: data.message || data.msg };
      } else {
        console.log(data);
        returnValue = { ok: false, data: "An error has occurred" };
      }
    }

    return returnValue;
  };
  return fetchData;
};

export default useFetch;
