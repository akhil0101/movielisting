
//API Details
const API_KEY="api_key=ca60385a6c478648425eec72b2edfebd";
const BASE_URL="https://api.themoviedb.org/3/";
const API_URL=BASE_URL+`discover/movie?sort_by=popularity.desc&`+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL=BASE_URL+'search/movie?'+API_URL;

//Picking up the DOM Elements

const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('search');
const toggle = document.getElementById('toggle');
const tagsE1 = document.getElementById('tags');
const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')
const date=document.getElementById('sortBydate')


var currentPage = 1;
var nextPage = 2;
var prevPage = 0;
var lastUrl = '';
var totalPages = 1000;


const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]

//ON reload

window.onload=function(){
    tagsE1.style.display='none';
}


getMovies(API_URL)
//GET data form Endpoint
async function getMovies(url){
    lastUrl = url;
    try{
        await fetch(url).then(res=>res.json()).then(data=>{
            console.log(data.results);
            if(data.results.length!==0){
                showMovies(data.results);
                currentPage = data.page;
                nextPage = currentPage + 1;
                prevPage = currentPage - 1;
                totalPages = data.total_pages;
    
                current.innerText = currentPage;
                if(currentPage <= 1){
                    prev.classList.add('disabled');
                    next.classList.remove('disabled')
                  }else if(currentPage>= totalPages){
                    prev.classList.remove('disabled');
                    next.classList.add('disabled')
                  }else{
                    prev.classList.remove('disabled');
                    next.classList.remove('disabled')
                  }
                  window.scrollTo(0, 0);
                 // tagsE1.scrollIntoView({behavior : 'smooth'})
      
            }
            else{
                main.innerHTML="<h1>Results Not Found</h1>"
            }
            
        })
    }
    catch(e){
        console.log(e);
    }
  
}

//add resullt to DOM
function showMovies(data){
    main.innerHTML='';
    let frag1 =document.createDocumentFragment();
    data.forEach(movie=>{
        const {title, poster_path, vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img loading="lazy" src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
            <div class="movie-info">
                <h5>${title}</h5>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                
            </div>
        
        `

        frag1.appendChild(movieEl);
    })
    main.appendChild(frag1);
}
//filtering based on rating
function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}

search.addEventListener('change',debounce);
//Search based on provided text
function debounce(e){
//console.log(e.target.value);
const value=e.target.value
if(value){
getMovies(SEARCH_URL+'&query='+value)
}
else{
    
getMovies(API_URL)
}

}

//show geners
toggle.addEventListener('click',()=>{
    if(tagsE1.style.display=='none'){
        tagsE1.style.display='block';
    }else{
        tagsE1.style.display='none';
    }
    setGenre();

})

var selectedGenre = []
//select the geners
function setGenre() {
    tagsE1.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagsE1.append(t);
    })
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length !=0){   
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }

}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{
            
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear X';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();            
            getMovies(API_URL);
        })
        tagsE1.append(clear);
    }
    
}
//pagination 
prev.addEventListener('click', () => {
    if(prevPage > 0){
      pageCall(prevPage);
    }
  })
  
  next.addEventListener('click', () => {
    if(nextPage <= totalPages){
      pageCall(nextPage);
    }
  })

  function pageCall(page){
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length -1].split('=');
    if(key[0] != 'page'){
      let url = lastUrl + '&page='+page
      getMovies(url);
    }else{
      key[1] = page.toString();
      let a = key.join('=');
      queryParams[queryParams.length -1] = a;
      let b = queryParams.join('&');
      let url = urlSplit[0] +'?'+ b
      getMovies(url);
    }
  }

  //sort by date
  date.addEventListener('change',function(e){
    if(date.value!='sort'){
      let sampleURL=BASE_URL+`discover/movie?sort_by=${date.value}&`+API_KEY;
      console.log(sampleURL);
         tagsE1.style.display='none';
     getMovies(sampleURL)
    }
  

  })

