'use strict';

const titleClickHandler = function(event){
  // console.log('Link was clicked!');
  // console.log(event);
  event.preventDefault();
  const clickedElement = this;
    
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  // console.log('clickedElement:', clickedElement);

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post ');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
};


const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list';

function generateTitleLinks(tagSelector = '', authorSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + tagSelector + authorSelector);
  // let html = '';
    
  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    titleList.insertAdjacentHTML('beforeend', linkHTML);
    // html = html + linkHTML;
    
  }
  // titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

function generateTags() {
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    /* get tags from data-tags attribute */
    const articlesTags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articlesTags.split(' ');

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {

      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      /* add generated code to html variable */
      tagsWrapper.insertAdjacentHTML('beforeend', linkHTML);
    }
    /* END LOOP: for each tag */
  }
  /* END LOOP: for every article: */
}

generateTags();

function tagClickHandler(event){

  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.slice(5);

  /* find all tag links with class active */
  const activeTagsLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for (let tagLink of activeTagsLinks) {
    /* remove class active */
    tagLink.classList.remove('active');
  }
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */
  const activeTags = document.querySelectorAll(`a[href*="${href}"]`);

  /* START LOOP: for each found tag link */
  for (let activeTag of activeTags){

    /* add class active */
    activeTag.classList.add('active');

  }
  /* END LOOP: for each found tag link */

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagsLinks = document.querySelectorAll('.list-horizontal a');
  /* START LOOP: for each link */
  for (let tagsLink of tagsLinks) {

    /* add tagClickHandler as event listener for that link */
    tagsLink.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
}

addClickListenersToTags();

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const authorsWrapper = article.querySelector('.post-author');
    const href = article.getAttribute('data-author');
    const linkHTML = '<a href="#author-' + href + '"><span>' + href + '</span></a>';
    console.log(linkHTML);
    authorsWrapper.insertAdjacentHTML('beforeend', linkHTML);
  }

}
generateAuthors();

function addClickListenersToAuthors() {
  const authorNames = document.querySelectorAll('.post-author a');
  for(let authorName of authorNames){
    authorName.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.slice(8);
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  for (let activeAuthorLink of activeAuthorLinks) {
    activeAuthorLink.classList.remove('active');
  }

  const activeAuthors = document.querySelectorAll(`a[href*="#author-${author}"]`);
  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.add('active');
  }
  
  generateTitleLinks('[data-author="' + author + '"]');
}