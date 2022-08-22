import './css/style.css';
import Notiflix from 'notiflix';
import NewsApiServ from './news-service';
import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css";

const formSearch = document.querySelector(".search-form");
const loadMore = document.querySelector(".load-more");
const gallery = document.querySelector(".gallery");
const spinner  = document.querySelector(".sk-circle");
const newsApiServ = new NewsApiServ();

showButton(false)

formSearch.addEventListener('submit', onSearch);
loadMore.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  showButton(false);
  newsApiServ.searchQuery = e.currentTarget.elements.searchQuery.value;
   if (newsApiServ.searchQuery === '') {
     Notiflix.Notify.failure('Enter the search value!');
    return;
  }
  newsApiServ.resetPage();
  gallery.innerHTML = "";
  
  try {
    
 
    const fetchCards = await newsApiServ.fetchArticles();
    const addCards = await addAllCards(fetchCards);

    if(fetchCards.totalHits>0){
     return  hoorey = await Notiflix.Notify.success(`Hooray! We found ${fetchCards.totalHits} images.`);
    }
    return addCards;
}
  catch (error)  {console.log(error.message) }
}
function enable() {
  loadMore.disabled = false;
    loadMore.classList.remove('dis-btn')
  spinner.classList.add('visually-hidden')
}
function disable() {
  loadMore.disabled = true;
  loadMore.classList.add('dis-btn')
  spinner.classList.remove('visually-hidden')
}

async function onLoadMore() {
  disable()
  
  try {

    const fetchCards = await newsApiServ.fetchArticles();
    const addCards = await addAllCards(fetchCards);
  enable()
    return addCards;
}
  catch (error)  {console.log(error.message) }
  
}

function renderCards(article) {
  
 
   

  const markap  = article.hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
    <a class="a-big" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
 </a>
</div>`
  })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markap);
 
  return
}
function addAllCards(articles) {
   if (articles.totalHits === 0) {
     showButton(false);
   return Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again."); 
  }
   else {
     showButton(true);
     renderCards(articles);
     console.log(articles.hits.length);
     console.log(newsApiServ.per_page);
     if(articles.hits.length < newsApiServ.per_page){
       Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
       showButton(false);
     }
  }
  simple();
}
function showButton(used) {
  loadMore.style.display = used ? 'block' : 'none';
}
// new
function simple(){
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh()
}