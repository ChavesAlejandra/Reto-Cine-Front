const date = new Date();
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
let sessions = [];

/* FETCH */
const fetchData = () =>
{
    fetch(`http://localhost:80/film/genre/${currentGenre}`)
    .then(res => res.json())
    .then(data =>
    {
        categoryFilms = data;
        console.log(data);
    }).then(x =>
    {
        fetch('http://localhost:80/session')
        .then(res => res.json())
        .then(data => {
            sessions = data;
            console.log(data);
            printData(categoryFilms);
        });
    });
}

const printData = (data) =>
{
    const popUp = document.getElementsByClassName('films__container__popUp')[0];
    const filmsContainer = document.getElementsByClassName('films__container')[0];
    const sessionContainer = document.getElementsByClassName('films__container__popUp__selectSession__container')[0];
    const buyEntriesButton = popUp.getElementsByClassName('films__container__popUp__buyEntries')[0];
    const selectSessionButton = document.getElementsByClassName('films__container__popUp__selectSession__button')[0];
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
            document.body.style.overflow = 'hidden';
            document.getElementsByTagName('header')[0].style.opacity = 0.8;
            document.getElementsByClassName('footer')[0].style.opacity = 0.8;
            document.getElementsByClassName('films__category')[0].style.opacity = 0.8;
            Array.from(document.getElementsByClassName('films__container__singular')).map(op => op.style.opacity = 0.8);
            popUp.style.pointerEvents = 'all';
            popUp.style.display = 'flex';
            
            popUp.getElementsByClassName('films__container__popUp__img')[0].getElementsByTagName('img')[0].src = `../Images/Movies/${el._genres[0].substring(0,1).toUpperCase().concat(el._genres[0].substring(1,20))}/${el._filmImg}`;
            popUp.getElementsByClassName('films__container__popUp__img')[0].getElementsByTagName('img')[0].alt = el._filmImg.replace('.jpg', '');
            
            popUp.getElementsByClassName('films__container__popUp__title')[0].textContent = el._title;
            popUp.getElementsByClassName('films__container__popUp__info__director')[0].textContent = `By: ${el._director}`;
            popUp.querySelector('.films__container__popUp__info__duration .val').textContent = `${el._duration}`;
            popUp.querySelector('.films__container__popUp__info__premiereYear .val').textContent = `${el._premiereYear}`;
            popUp.querySelector('.films__container__popUp__info__ageRestriction .val').textContent = `${el._ageRestriction}`;
            popUp.getElementsByClassName('films__container__popUp__description')[0].textContent = `${el._description}`;

            Array.from(sessionContainer.children).filter(ch => !ch.classList.contains('default')).map(ch => ch.remove());
            document.getElementsByClassName('default')[0].addEventListener('click', (ev) => {
                Array.from(ev.target.parentElement.children).filter(ch => ch.classList.contains('selected')).map(ch => ch.classList.remove('selected'));
                ev.target.classList.add('selected');
                selectSessionButton.textContent = ev.target.textContent;
                ev.target.parentElement.parentElement.children[0].style.display = 'none';
                
                if (selectSessionButton.textContent === 'Select Session')
                {
                    buyEntriesButton.disabled = true;
                    buyEntriesButton.style.backgroundColor = '#AFAFAF';
                    buyEntriesButton.style.cursor = 'not-allowed';
                }
                else
                {
                    buyEntriesButton.disabled = false;
                    buyEntriesButton.style.backgroundColor = '#D4A50D';
                    buyEntriesButton.style.cursor = 'pointer';
                }

                localStorage.setItem('session', ev.target.value);
            });

            popUp.getElementsByClassName('films__container__popUp__selectSession__button')[0].addEventListener('click', (ev) => {
                ev.target.style.borderRadius = '0 0 5px 5px';
                ev.target.parentElement.children[0].style.display = 'block';
            });

            sessions.filter(se => se._film._id === el._id).forEach(se =>
            {
                const seDate = new Date(se._date);
                const seDateDay = seDate.getDate().toString().length < 2 ? '0'.concat(seDate.getDate().toString()) : seDate.getDate();
                const seDateMonth = (seDate.getMonth()+1).toString().length < 2 ? '0'.concat((seDate.getMonth()+1).toString()) : (seDate.getMonth()+1);
                const seDateYear = seDate.getFullYear().toString().length < 2 ? '0'.concat(seDate.getFullYear().toString()) : seDate.getFullYear();
                const seDateHour = seDate.getHours().toString().length < 2 ? '0'.concat(seDate.getHours().toString()) : seDate.getHours();
                const seDateMin = seDate.getMinutes().toString().length < 2 ? '0'.concat(seDate.getMinutes().toString()) : seDate.getMinutes();

                const currentSession = sessionContainer.appendChild(document.createElement('li'));
                currentSession.classList.add('films__container__popUp__selectSession__container__opt');
                currentSession.value = se._id;
                currentSession.textContent = `${seDateDay}-${seDateMonth}-${seDateYear} ${seDateHour}:${seDateMin}`;

                currentSession.addEventListener('click', (ev) => {
                    Array.from(sessionContainer.children).filter(ch => ch.classList.contains('selected')).map(ch => ch.classList.remove('selected'));
                    currentSession.classList.add('selected');
                    currentSession.value = se._id;
                    selectSessionButton.textContent = ev.target.textContent;
                    ev.target.parentElement.parentElement.children[0].style.display = 'none';

                    if (selectSessionButton.textContent === 'Select Session')
                    {
                        buyEntriesButton.disabled = true;
                        buyEntriesButton.style.backgroundColor = '#AFAFAF';
                        buyEntriesButton.style.cursor = 'not-allowed';
                    }
                    else
                    {
                        buyEntriesButton.disabled = false;
                        buyEntriesButton.style.backgroundColor = '#D4A50D';
                        buyEntriesButton.style.cursor = 'pointer';
                        localStorage.setItem('session', se._id);
                    }
                });
                
                if (seDate < date || se._full) { currentSession.style.display = 'none'; }
            });

            popUp.getElementsByClassName('films__container__popUp__close')[0].addEventListener('click', () => {
                document.body.style.pointerEvents = 'all';
                document.body.style.overflow = 'visible';
                document.getElementsByTagName('header')[0].style.opacity = 1;
                document.getElementsByClassName('footer')[0].style.opacity = 1;
                document.getElementsByClassName('films__category')[0].style.opacity = 1;
                Array.from(document.getElementsByClassName('films__container__singular')).map(op => op.style.opacity = 1);
                popUp.style.display = 'none';
            });

            buyEntriesButton.addEventListener('click', (ev) => {
                if (!ev.target.disabled)
                {
                    const a = document.createElement('a');
                    a.href = `./seats.html?session=${localStorage.getItem('session')}`;
                    a.click();
                }
            });

            popUp.addEventListener('click', (ev) => {
                if (!(ev.target.classList.contains('films__container__popUp__selectSession__button') || ev.target.classList.contains('films__container__popUp__selectSession__container') || ev.target.classList.contains('films__container__popUp__selectSession')))
                {
                    popUp.getElementsByClassName('films__container__popUp__selectSession__button')[0].style.borderRadius = '5px 5px 5px 5px';
                    popUp.getElementsByClassName('films__container__popUp__selectSession__container')[0].style.display = 'none';
                }
                else { popUp.getElementsByClassName('films__container__popUp__selectSession__button')[0].style.borderRadius = '0 0 5px 5px'; }
            });
        });
    });
}
