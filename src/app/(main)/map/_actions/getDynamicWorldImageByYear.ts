/**
 * Todo: implement the function to get the dynamic world image by year by callng the backend API
 * @param year
 * @returns image URL of the image or null if data is unavailable
 */
export async function getDynamicWorldImageByYear(year: number): Promise<string | null> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `/DW_RGB_2023_Q1.tif`;
  // return null;
}