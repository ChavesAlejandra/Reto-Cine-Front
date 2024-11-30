
let ticket;
let menus;
let menuCount = 0;
let menuSpecificCount = [];

document.addEventListener('DOMContentLoaded', () => {
    const x = 0;

    document.getElementsByClassName('entries__buy')[0].addEventListener('click', () => {
        putFetchData();
    });

    fetchData();
})

const fetchData = () =>
{
    fetch('http://localhost:5030/ticket/last')
    .then(res => res.json())
    .then(data =>
    {
        ticket = data;
        console.log(data);
        printData(data);
    }).then(x =>
    {
        fetch('http://localhost:5030/menu')
        .then(res => res.json())
        .then(data =>
        {
            menus = data;
            console.log(data);
            data.forEach((el, index) => { menuSpecificCount[index] = 0; });
            printMenuData(data);
        });
    });
}

const putFetchData = () =>
{
    const putData = [];
    
    menus.forEach(el =>
    {
        for (var i = 0; i < menuSpecificCount[el._id-1]; i++)
        {
            putData.push(el);
        }
    });

    fetch(`http://localhost:5030/ticket/id/${ticket._id}/menus`,
    {
        method: 'PUT',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(putData)
    })
    .then(res => res.json())
    .then(data => console.log(data));
}

const printData = (data) =>
{
    const img = document.getElementsByClassName('entries__info__filmImg')[0].children[0];
    img.src = `../Images/Movies/${data._session._film._genres[0]}/${data._session._film._filmImg}`;
    img.alt = data._session._film._filmImg.replace('.jpg', '');
    document.getElementsByClassName('entries__info__ticket__id')[0].textContent = data._shownId;
    document.getElementsByClassName('entries__info__ticket__date')[0].textContent = data._session._date.replace('T', ' ');
    document.getElementsByClassName('entries__info__ticket__room')[0].textContent = data._room;
    const seatsContainer = document.getElementsByClassName('entries__info__ticket__seats')[0];
    data._seats.forEach(el =>
    {
        const singular = seatsContainer.appendChild(document.createElement('div'));
        singular.classList.add('entries__info__ticket__seats__singular');
        const pos = singular.appendChild(document.createElement('p'));
        pos.classList.add('entries__info__ticket__seats__singular__pos');
        pos.textContent = `Pos: ${el._id}`;
        const type = singular.appendChild(document.createElement('p'));
        type.classList.add('entries__info__ticket__seats__singular__type');
        type.textContent = `Type: ${el._type}`;
    });
}

const printMenuData = (data) =>
{
    const menusContainer = document.getElementsByClassName('entries__menus')[0];
    data.forEach(el =>
    {
        const menuSing = menusContainer.appendChild(document.createElement('div'));
        menuSing.classList.add('entries__menus__singular')
        const name = menuSing.appendChild(document.createElement('h3'));
        name.textContent = el._name
        const imgDiv = menuSing.appendChild(document.createElement('div'));
        imgDiv.classList.add('entries__menus_singular__img');
        const img = imgDiv.appendChild(document.createElement('img'));
        img.src = `../Images/Menus/${el._img}`;
        img.alt = el._img.replace('.jpg', '');
        const price = menuSing.appendChild(document.createElement('p'));
        price.classList.add('entries__menus__singular__price');
        price.textContent = `${el._price}€`;
        const opt = menuSing.appendChild(document.createElement('div'));
        opt.classList.add('entries__menus__singular__options');
        const lessDiv = opt.appendChild(document.createElement('div'));
        lessDiv.classList.add('entries__menus__singular__options__less');
        const less = lessDiv.appendChild(document.createElement('img'));
        less.src = '../Images/Icons/less_blanco.png';
        less.alt = 'less_blanco';
        const inp = opt.appendChild(document.createElement('input'));
        inp.classList.add('entries__menus__singular__options__inp');
        inp.type = 'number';
        inp.min = '0';
        inp.max = ticket._seats.length;
        const moreDiv = opt.appendChild(document.createElement('div'));
        moreDiv.classList.add('entries__menus__singular__options__more');
        const more = moreDiv.appendChild(document.createElement('img'));
        more.src = '../Images/Icons/more_blanco.png';
        more.alt = 'more_blanco';

        lessDiv.addEventListener('click', () => {
            if (menuCount > 0 && menuSpecificCount[el._id-1] > 0)
            {
                inp.value--;
                inp.value = inp.value <= 0 ? 0 : inp.value;
                menuSpecificCount[el._id-1]--;

                menuCountUpdate();
            }
        });
        moreDiv.addEventListener('click', () => {
            if (menuCount < ticket._seats.length && menuSpecificCount[el._id-1] < ticket._seats.length)
            {
                inp.value++;
                inp.value = inp.value >= ticket._seats.length ? ticket._seats.length : inp.value;
                menuSpecificCount[el._id-1]++;

                menuCountUpdate();
            }
        });
        inp.addEventListener('change', () => {
            inp.value = inp.value <= 0 ? 0 : inp.value;
            inp.value = inp.value >= ticket._seats.length ? ticket._seats.length : inp.value;
            menuSpecificCount[el._id-1] = inp.value;

            menuCountUpdate();
        });
    });
    menuCountUpdate();
}

const menuCountUpdate = () =>
{
    const totalPriceText = document.getElementsByClassName('entries__buy__price')[0];
    let totalPrice = 0;
    ticket._seats.forEach(el => totalPrice += el._price);
    menuCount = 0;
    menuSpecificCount.forEach((el, index) =>
    {
        menuCount += el;
        if (el > 0) { totalPrice += menus[index]._price*el; }
    });

    totalPriceText.textContent = `${totalPrice}€`;
}
