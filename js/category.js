let currentGenre = '';
let currentCategoryId;
const categories =
[
    {
        id: 1,
        name: 'Animation',
        img: 'animation.jpg'
    },
    {
        id: 2,
        name: 'Horror',
        img: 'horror.jpg'
    },
    {
        id: 3,
        name: 'Romantic',
        img: 'romantic.jpg'
    },
    {
        id: 4,
        name: 'SciFi',
        img: 'sciFi.jpg'
    }
]

document.addEventListener('DOMContentLoaded', () => {
    const categoryTitle = document.getElementsByClassName('films__category__carousel__title')[0];
    const categoryImg = document.getElementsByClassName('films__category__carousel__img')[0].getElementsByTagName('img')[0];
    currentGenre = categoryTitle.textContent.toLowerCase();
    currentCategoryId = categories.filter(el => el.name === categoryTitle.textContent)[0].id;

    document.getElementsByClassName('films__category__left')[0].addEventListener('click', () => {
        currentCategoryId--;
        currentCategoryId = currentCategoryId<1 ? 4 : currentCategoryId;

        const cat = categories.filter(el => el.id === currentCategoryId)[0];
        categoryTitle.textContent = cat.name;
        categoryImg.src = `../Images/Movies/Categories/${cat.img}`;
        categoryImg.alt = cat.img.replace('.jpg', '');
        currentGenre = cat.img.replace('.jpg', '');

        fetchData();
    });
    document.getElementsByClassName('films__category__right')[0].addEventListener('click', () => {
        currentCategoryId++;
        currentCategoryId = currentCategoryId>4 ? 1 : currentCategoryId;

        const cat = categories.filter(el => el.id === currentCategoryId)[0];
        categoryTitle.textContent = cat.name;
        categoryImg.src = `../Images/Movies/Categories/${cat.img}`;
        categoryImg.alt = cat.img.replace('.jpg', '');
        currentGenre = cat.img.replace('.jpg', '');

        fetchData();
    });

    fetchData();
})

let categoryFilms = [];

/* FETCH */
const fetchData = () =>
{
    fetch(`https://localhost:7264/film/genre/${currentGenre}`)
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
    const filmsContainer = document.getElementsByClassName('films__container')[0];
    filmsContainer.innerHTML = '';
    data.forEach(el =>
    {
        const filmContainerMain = filmsContainer.appendChild(document.createElement('div'));
        filmContainerMain.classList.add('films__container__singular');

        const filmImg = filmContainerMain.appendChild(document.createElement('div'));
        filmImg.classList.add('films__container__singular__img');
        const img = filmImg.appendChild(document.createElement('img'));
        img.src = `../Images/Movies/${el._genres[0].substring(0,1).toUpperCase().concat(el._genres[0].substring(1,20))}/${el._filmImg}`
        img.alt = el._filmImg.replace('.jpg', '');

        const filmTitle = filmContainerMain.appendChild(document.createElement('p'));
        filmTitle.classList.add('films__container__singular__title');
        filmTitle.textContent = el._title;

        const filmDirector = filmContainerMain.appendChild(document.createElement('p'));
        filmDirector.classList.add('films__container__singular__director');
        filmDirector.textContent = `By: ${el._director}`;
    });
}
