window.onload = () => {

    var today = new Date();

    var year = today.getFullYear();
    var month = today.getMonth();
    var date = today.getDate();


    var mainContent = document.querySelector('.main');
    var daysTillEndOfWeek = moment().endOf('week').diff(moment(),'days');
    console.log(daysTillEndOfWeek);
    for(var i=0; i<= daysTillEndOfWeek+1; i++){

        var day=new Date(year, month, date + i);
        var streamers = schedule[moment(day).format('yyyy-MM-DD')];
        console.log(streamers, moment(day).subtract(7, "days"));
        if (!streamers) streamers[moment(day).subtract(7, "days").format('yyyy-MM-DD')]
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
            streamers.sort((a,b) => moment(a.start) - moment(b.start) )
            for (let index = 0; index < streamers.length; index++) {
                var element = streamers[index];
                var streamer =  document.createElement('a');

                var text = `${element.who} @ ${moment(element.start).format('LT')}`;

                if (element.end) text =  text + `/${moment(element.end).format('LT')}`;
                if (element.title) text =  text + ` - <span>${element.title}</span>`;

                streamer.href = `https://twitch.tv/${element.who}`;
                streamer.classList = 'streamer';

                streamer.style.cssText = `--avatar: `;

                if (moment().isBetween(moment(element.start).subtract(2, 'hours'), element.end)) {
                    streamer.classList.add('live');
                    text = '🔴 LIVE - ' +text;
                }

                streamer.innerHTML = `<img src='https://avatar.glue-bot.xyz/twitch/${element.who}' alt='Profile photo of ${element.who}' />` + text;
                cell.appendChild(streamer);

            }
        }


        mainContent.appendChild(cell);
    }

}

