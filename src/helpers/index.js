import { filename } from "pathe/utils";

export const generateID = () => {
  return Math.random().toString(32).substring(2) + Date.now().toString(32);
};

export const parseNumberToCurrency = (number) => {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);

  return currency;
};

export const parseStampToLocaleDate = (timestamp) => {
  const date = new Date(timestamp);

  const dateOptions = {
    day: "numeric",
    year: "numeric",
    month: "long",
  };

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  // Obten la fecha y la hora formateadas
  const formattedDate = date.toLocaleDateString(undefined, dateOptions);
  const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

  return `${formattedDate} - ${formattedTime}`;
};

export const getImageUrl = (name) => {
  const glob = import.meta.glob("/src/assets/img/*", { eager: true });
  const images = Object.fromEntries(
    Object.entries(glob).map(([key, value]) => [filename(key), value.default])
  );

  return images[name];
};

export const calculateCurrentPercentage = (budget, totalSpend) => {
  const percentage = (totalSpend * 100) / budget;
  return Math.round(percentage);
};
