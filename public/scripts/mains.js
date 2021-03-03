window.onload = () => {

    var today = new Date();

    var year = today.getFullYear();
    var month = today.getMonth();
    var date = today.getDate();


    var mainContent = document.querySelector('.main');

    for(var i=0; i<5; i++){

        var day=new Date(year, month, date + i);
        var streamers = schedule[moment(day).format('yyyy-MM-DD')];
        var cell= document.createElement('div');
        cell.classList.add('main__date');

        var timeContainer = document.createElement('span');
        timeContainer.classList = 'dateDisplay';

        cell.appendChild(timeContainer);

        var dateContainer =  document.createElement('span');
        dateContainer.classList = 'date';
        dateContainer.innerText = moment(day).format('Do MMM');
        timeContainer.appendChild(dateContainer);

        var dayContainer = document.createElement('span');
        dayContainer.classList = 'day';
        dayContainer.innerText = moment(day).format('ddd');
        timeContainer.appendChild(dayContainer);



        if (streamers) {
            console.log(streamers);
            for (let index = 0; index < streamers.length; index++) {
                console.log(index);
                var element = streamers[index];
                var streamer =  document.createElement('a');
                streamer.href = `https://twitch.tv/${element.who}`;
                streamer.classList = 'streamer';
                streamer.innerHTML = `${element.who} @ ${moment(element.start).format('LT')}`;
                cell.appendChild(streamer);

            }
        }


        mainContent.appendChild(cell);
    }

}

