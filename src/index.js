import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { serviceSearch } from './serviceSearch.js';

const elements = {
  form: document.querySelector('.search-form'),
  cardWrapper: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more-hidden'),
};

const gallery = new SimpleLightbox('.gallery a');
let quantityImg = 0;
let currentPage = 1;

elements.form.addEventListener(`submit`, handlerSubmit);
elements.cardWrapper.addEventListener(`click`, handlercardWrapper);
elements.btnLoadMore.addEventListener(`click`, handlerLoadMore);

async function handlerSubmit(evt) {
  evt.preventDefault();
  elements.cardWrapper.innerHTML = '';
  elements.btnLoadMore.classList.replace('load-more', 'load-more-hidden');

  const searchQuery = evt.target.elements.searchQuery.value;
  localStorage.setItem('input-value', searchQuery);

  if (!searchQuery) {
    return Notify.failure('Enter your search details.');
  }
  try {
    const data = await serviceSearch(currentPage, searchQuery);

    quantityImg += data.hits.length;

    elements.cardWrapper.insertAdjacentHTML(
      'beforeend',
      createCards(data.hits)
    );

    if (data.totalHits !== 0) {
      Notify.info(`"Hooray! We found ${data.totalHits} images."`);
    }

    if (data.totalHits > quantityImg) {
      elements.btnLoadMore.classList.replace('load-more-hidden', 'load-more');
    }

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    Notify.failure(error.message);
  } finally {
    gallery.refresh();
  }
}

function handlercardWrapper(evt) {
  evt.preventDefault();
  gallery.next();
}

async function handlerLoadMore() {
  try {
    const inputValue = localStorage.getItem('input-value');
    currentPage += 1;
    const data = await serviceSearch(currentPage, inputValue);
    quantityImg += data.hits.length;
    const cardsHTML = createCards(data.hits);
    elements.cardWrapper.insertAdjacentHTML('beforeend', cardsHTML);
    if (data.totalHits <= quantityImg) {
      elements.btnLoadMore.classList.replace('load-more', 'load-more-hidden');
    }
  } catch (error) {
    Notify.failure(error.message);
  } finally {
    gallery.refresh();
  }
}

function createCards(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class ="photo-card"> 
       <a class="gallery-link" href="${largeImageURL}"> 
       <img src="${webformatURL}" alt="${tags}" loading="lazy" />
       <div class="info">
       <p class="info-item">
         <b>Likes <span class= "item-text">${likes}</span></b>
       </p>
       <p class="info-item">
         <b>Views <span class= "item-text">${views}</span></b>
       </p>
       <p class="info-item">
         <b>Comments <span class= "item-text">${comments}</span></b>
       </p>
       <p class="info-item">
         <b>Downloads <span class= "item-text">${downloads}</span></b>
       </p>
     </div>
       </a>
    </div>`;
      }
    )
    .join('');
}
