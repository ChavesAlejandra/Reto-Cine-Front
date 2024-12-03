
const par = new URLSearchParams(window.location.search);
const currentSession = par.get('session');

document.addEventListener('DOMContentLoaded', () => {
    const seatsBuy = document.getElementsByClassName('seats__buy')[0];
    seatsBuy.addEventListener('click', () => {
        if (currentSeats.length > 0)
        {
            localStorage.setItem('seats', currentSeats);
            postTicketFetchData(currentSeats);
        }
    });
    fetchData();
})

let session = [];
const fetchData = () =>
{
    fetch(`http://localhost:5030/session/id/${currentSession}`)
    .then(res => res.json())
    .then(data =>
    {
        console.log(data);
        session = data[0];
        printData(session);
    });
}

const putFetchData = (seat, bool) =>
{
    fetch(`http://localhost:5030/session/id/${currentSession}/seat/${seat._id}/occupied/${bool}`,
    {
        method: 'PUT'
    })
    .then(res => res.json())
    .then(data => console.log(data));
}

const postTicketFetchData = (seat) =>
{
    const postData = seat;
    console.log(postData);
    fetch(`http://localhost:5030/ticket/session/${currentSession}`,
    {
        method: 'POST',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(postData)
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .then(x =>
    {
        const a = document.createElement('a');
        a.href = './entries.html';
        a.click();
    });
}

let currentSeats = [];
const printData = (data) =>
{
    const seatsContainer = document.getElementsByClassName('seats__container__seats__positions')[0];
    const seatsBuyPrice = document.getElementsByClassName('seats__buy__price')[0];
    data._seats.forEach(el =>
    {
        const imgDiv = seatsContainer.appendChild(document.createElement('div'));
        imgDiv.id = el._id;
        const img = imgDiv.appendChild(document.createElement('img'));
        img.src = `../Images/Icons/${el._img}`;
        img.alt = el._img.replace('.png', '');

        imgDiv.addEventListener('click', () => {
            if (!el._occupied && !currentSeats.filter(cs => cs._id === el._id).length>0)
            {
                img.src = '../Images/Icons/seat_select.png';
                img.alt = 'seat_select';
                currentSeats.push(el);
                if (currentSeats.length === 0)
                {
                    seatsBuyPrice.parentElement.disabled = true;
                    seatsBuyPrice.parentElement.classList.remove('seats__buyEnabled');
                }
                else
                {
                    seatsBuyPrice.parentElement.disabled = false;
                    seatsBuyPrice.parentElement.classList.add('seats__buyEnabled');
                }

                putFetchData(el, true);
            }
            else if (currentSeats.filter(cs => cs._id === el._id).length>0)
            {
                currentSeats.splice(currentSeats.indexOf(el), 1);
                img.src = `../Images/Icons/${el._img}`;
                img.alt = el._img.replace('.png', '');
                if (currentSeats.length === 0)
                {
                    seatsBuyPrice.parentElement.disabled = true;
                    seatsBuyPrice.parentElement.classList.remove('seats__buyEnabled');
                }
                else
                {
                    seatsBuyPrice.parentElement.disabled = false;
                    seatsBuyPrice.parentElement.classList.add('seats__buyEnabled');
                }

                putFetchData(el, false);
            }

            let price = 0;
            currentSeats.map(cs => price += cs._price);
            seatsBuyPrice.textContent = `${price}€`;
        });
    });
}
