'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagsLink: Handlebars.compile(document.querySelector('#template-tags-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorListlink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML),
};

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
    
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

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
  optArticleTagsSelector = '.post-tags .list',
  
  optCloudClassCount = 5;

function generateTitleLinks(tagSelector = '', authorSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + tagSelector + authorSelector);
    
  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }

  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {
    min: 999999,
    max: 0,
  };
  for (let tag in tags) {
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }
  return params;
}
function calculateTagClass (count, params){
  
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return `tag-size-${classNumber}`;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};
  /* [DONE] find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* [DONE] START LOOP: for every article: */
  for (let article of articles) {

    /* [DONE] find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    /* [DONE] get tags from data-tags attribute */
    const articlesTags = article.getAttribute('data-tags');

    /* [DONE] split tags into array */
    const articleTagsArray = articlesTags.split(' ');
    /* [DONE] START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      const linkHTMLData = {tagName: tag};
      const linkHTML = templates.tagsLink(linkHTMLData);

      /* add generated code to html variable */
      tagsWrapper.insertAdjacentHTML('beforeend', linkHTML);

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]){
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    /* END LOOP: for each tag */
  }
  /* END LOOP: for every article: */

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');

  /* [NEW] create variable for all links HTML code */
  let tagsParams = calculateTagsParams(allTags);
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /* [NEW] END LOOP: for each tag in allTags: * 

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event){
  /* [DONE] prevent default action for this event */
  event.preventDefault();
  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.slice(5);
  /* [DONE] find all tag links with class active */
  const activeTagsLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* [DONE] START LOOP: for each active tag link */
  for (let tagLink of activeTagsLinks) {
    /* remove class active */
    tagLink.classList.remove('active');
  }
  /* END LOOP: for each active tag link */

  /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
  const activeTags = document.querySelectorAll(`a[href*="${href}"]`);

  /* [DONE] START LOOP: for each found tag link */
  for (let activeTag of activeTags){

    /* add class active */
    activeTag.classList.add('active');

  }
  /* END LOOP: for each found tag link */

  /* [DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* [DONE] find all links to tags */
  const tagsLinks = document.querySelectorAll('.list-horizontal a');
  const tagsCloud = document.querySelectorAll('.tags a');
  /* [DONE] START LOOP: for each link */
  for (let tagsLink of tagsLinks) {

    /* add tagClickHandler as event listener for that link */
    tagsLink.addEventListener('click', tagClickHandler);
  }
  for (let tagCloud of tagsCloud) {

    /* add tagClickHandler as event listener for that link */
    tagCloud.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
}

addClickListenersToTags();

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);
  let allAuthors = {};

  for (let article of articles) {
    const authorsWrapper = article.querySelector('.post-author');
    const href = article.getAttribute('data-author');
    const linkHTMLData = {author: href};
    const linkHTML = templates.authorLink(linkHTMLData);
    // const linkHTML = `<a href="#author-${href}">${href}</a>`;
    authorsWrapper.insertAdjacentHTML('beforeend', linkHTML);
    if(!allAuthors[href]){
      allAuthors[href] = 1;
    } else {
      allAuthors[href]++;
    }
  }
  
  const authorList = document.querySelector('.authors');
  const allAuthorsData = {authors: []};


  for(let author in allAuthors){
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
    });
  }
  // console.log(allAuthorsData);
  authorList.innerHTML = templates.authorListlink(allAuthorsData);

}
generateAuthors();

function addClickListenersToAuthors() {
  const authorNames = document.querySelectorAll('.post-author a, .authors a');
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