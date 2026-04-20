/**
 * This function is used to get the years from the database.
 * Years are the working years of the project. This case 2016-2026.
 * Everyyear, it will add 1 to the last year.
 * @returns {Promise<number[]>} - The years from the database.
 */
export async function getYears() {
  const currentYear = new Date().getUTCFullYear();
  const years = [];
  for (let year = 2016; year <= currentYear; year++) {
    years.push(year);
  }

  return years;
}