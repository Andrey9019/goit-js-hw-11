import { Notify } from 'notiflix/build/notiflix-notify-aio';
export { serviceSearch };

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39268708-5279c748fba761d3085ad3b24';
async function serviceSearch(currentPage, searchQuery) {
  const params = new URLSearchParams({
    key: API_KEY,
    image_type: `photo`,
    orientation: `horizontal`,
    safesearch: `true`,
    per_page: '40',
    q: searchQuery,
    page: currentPage,
  });

  try {
    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    Notify.failure(
      'На жаль, немає зображень, що відповідають вашому запиту. Будь ласка, спробуйте ще раз.'
    );
    throw error;
  }
}
