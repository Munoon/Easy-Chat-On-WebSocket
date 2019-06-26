const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
];

export function formatDate(stringDate) {
    let date = new Date(stringDate);

    let day = date.getDate();
    let month = monthNames[date.getMonth()];
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10)
        minutes = `0${minutes}`;

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
}