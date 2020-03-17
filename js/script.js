'use strict';

const titleClickHandler = function(event){
  // console.log('Link was clicked!');
  // console.log(event);
  event.preventDefault();
  console.log(event);
  const clickedElement = this;
  console.log(this);
    
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

function generateTitleLinks(){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector);
  let html = '';
    
  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    titleList.insertAdjacentHTML('beforeend', linkHTML);
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function generateTags() {
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
  
    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articlesTags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articlesTags.split(' ');

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';

      /* add generated code to html variable */
      html = html + linkHTML;
    }
    /* END LOOP: for each tag */

    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.insertAdjacentHTML('afterend', html);
  }

  /* END LOOP: for every article: */
}

generateTags();