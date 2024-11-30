
document.addEventListener('DOMContentLoaded', () => {
    const x = 0;

    fetchData();
})

const fetchData =() =>
{
    fetch('http://localhost:5030/ticket/last')
    .then(res => res.json())
    .then(data =>
    {
        console.log(data);
        printData(data);
    });

    /* Menus fetch */
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
