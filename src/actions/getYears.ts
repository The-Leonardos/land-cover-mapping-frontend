/**
 * This function is used to get the years from the database.
 * Years are the working years of the project. This case 2016-2026.
 * Everyyear, it will add 1 to the last year.
 * @returns {Promise<number[]>} - The years from the database.
 */
// export async function getYears() {
//   //todo: call the backend api to get the years
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   return [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
// }
export async function getYears() {
  //todo: call the backend api to get the years
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
}