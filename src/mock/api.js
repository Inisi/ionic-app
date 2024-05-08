import mockData from "./mockData";

export const fetchMockData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return mockData;
};
