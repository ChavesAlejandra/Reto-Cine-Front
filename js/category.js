const par = new URLSearchParams(window.location.search);
let currentGenre = par.get('cat');
let currentCategoryId;
const categories =
[
    {
        id: 1,
        name: 'Animation'
    },
    {
        id: 2,
        name: 'Horror'
    },
    {
        id: 3,
        name: 'Romantic'
    },
    {
        id: 4,
        name: 'SciFi'
    }
]

document.addEventListener('DOMContentLoaded', () => {
    const categoryTitle = document.getElementsByClassName('films__category__title')[0];
    if (currentGenre == undefined) { currentGenre = categoryTitle.textContent.toLowerCase(); }
    else { categoryTitle.textContent = currentGenre.substring(0, 1).toUpperCase().concat(currentGenre.substring(1, 20)); }
    currentCategoryId = categories.filter(el => el.name === categoryTitle.textContent)[0].id;

    document.getElementsByClassName('films__category__left')[0].addEventListener('click', () => {
        currentCategoryId--;
        currentCategoryId = currentCategoryId<1 ? 4 : currentCategoryId;

        const cat = categories.filter(el => el.id === currentCategoryId)[0];
        categoryTitle.textContent = cat.name;
        currentGenre = cat.name.substring(0, 1).toLowerCase().concat(cat.name.substring(1, 20));

        fetchData();
    });
    document.getElementsByClassName('films__category__right')[0].addEventListener('click', () => {
        currentCategoryId++;
        currentCategoryId = currentCategoryId>4 ? 1 : currentCategoryId;

        const cat = categories.filter(el => el.id === currentCategoryId)[0];
        categoryTitle.textContent = cat.name;
        currentGenre = cat.name.substring(0, 1).toLowerCase().concat(cat.name.substring(1, 20));

        fetchData();
    });

    fetchData();
})

let categoryFilms = [];

/* FETCH */
const fetchData = () =>
{
    fetch(`http://localhost:5030/film/genre/${currentGenre}`)
    .then(res => res.json())
    .then(data =>
        {
            categoryFilms = data;
            console.log(data);
            printData(data);
        });
}

const printData = (data) =>
{
    const popUp = document.getElementsByClassName('films__container__popUp')[0];
    const filmsContainer = document.getElementsByClassName('films__container')[0];
    Array.from(filmsContainer.getElementsByClassName('films__container__singular')).forEach(rm => rm.remove());
    data.forEach(el =>
    {
        const filmContainerMain = filmsContainer.appendChild(document.createElement('div'));
        filmContainerMain.classList.add('films__container__singular');

        const filmImg = filmContainerMain.appendChild(document.createElement('div'));
        filmImg.classList.add('films__container__singular__img');
        const img = filmImg.appendChild(document.createElement('img'));
        img.src = `../Images/Movies/${el._genres[0].substring(0,1).toUpperCase().concat(el._genres[0].substring(1,20))}/${el._filmImg}`;
        img.alt = el._filmImg.replace('.jpg', '');

        const filmTitle = filmContainerMain.appendChild(document.createElement('p'));
        filmTitle.classList.add('films__container__singular__title');
        filmTitle.textContent = el._title;

        const filmDirector = filmContainerMain.appendChild(document.createElement('p'));
        filmDirector.classList.add('films__container__singular__director');
        filmDirector.textContent = `By: ${el._director}`;


        filmImg.addEventListener('click', () => {
            document.body.style.pointerEvents = 'none';
            popUp.style.pointerEvents = 'all';
            popUp.style.display = 'flex';
            
            popUp.getElementsByClassName('films__container__popUp__img')[0].getElementsByTagName('img')[0].src = `../Images/Movies/${el._genres[0].substring(0,1).toUpperCase().concat(el._genres[0].substring(1,20))}/${el._filmImg}`;
            popUp.getElementsByClassName('films__container__popUp__img')[0].getElementsByTagName('img')[0].alt = el._filmImg.replace('.jpg', '');
            
            popUp.getElementsByClassName('films__container__popUp__title')[0].textContent = el._title;
            popUp.getElementsByClassName('films__container__popUp__info__director')[0].textContent = `By: ${el._director}`;
            popUp.getElementsByClassName('films__container__popUp__info__duration')[0].textContent = `${el._duration}s`;
            popUp.getElementsByClassName('films__container__popUp__info__premiereYear')[0].textContent = `Premiere Year: ${el._premiereYear}`;
            popUp.getElementsByClassName('films__container__popUp__info__ageRestriction')[0].textContent = `Minimum Age: ${el._ageRestriction}`;
            popUp.getElementsByClassName('films__container__popUp__info__description')[0].textContent = `Summary${el._description}`;

            popUp.getElementsByClassName('films__container__popUp__close')[0].addEventListener('click', () => {
                document.body.style.pointerEvents = 'all';
                popUp.style.display = 'none';
            });

            popUp.getElementsByClassName('films__container__popUp__buyEntries')[0].addEventListener('click', () => {
                const a = document.createElement('a');
                a.href = `./seats.html?film=${el._id}`;
                a.click();
            });
        });
    });
}
