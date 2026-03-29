const UNIT_MAP = {
  PIECE: "шт.",
  KILOGRAM: "кг",
  GRAM: "г",
  LITRE: "л",
  METER: "м"
};

/**
 * Translates a unit enum to its Russian representation.
 * 
 * @param {string} unit - The unit enum from the backend
 * @returns {string} The translated unit
 */
export const translateUnit = (unit) => {
  return UNIT_MAP[unit] || unit || "";
};
