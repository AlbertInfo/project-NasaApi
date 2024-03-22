const curiosityData =
  "https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json";

let fetchCuriosityData = () => {
  let data = fetch(curiosityData)
    .then((res) => res.json())
    .then((data) => data.soles);

  return data;
};

fetchCuriosityData()
  .then((res) => {
    let marsWheaterData = [];
    for (let i = 0; i < 669; i++) {
      marsWheaterData.push(res[i]);
    }
    return marsWheaterData;
  })
  .then((marsWheaterData) => {
    let  today = marsWheaterData[0]
    let mars_today = document.querySelector('#mars-today')
    mars_today.classList.add('mars-today')
    document.querySelector('#mars-today').innerHTML=`
    <h2>Curiosity Today!</h2>
    <p>This is my <span>${today.sol}</span> Martian day</p>
    <p>Today wheather is <span>${today.atmo_opacity}</span></p>`


    
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => {
      myChart(marsWheaterData);
    });
    let myChart = (marsWheaterData) => {
      
      let formattedData = marsWheaterData.map((data) => {
        
        return [data.sol, +data.min_temp, +data.max_temp];
      });
     
      var chartData = [["Date", "Min", "Max"]];

      formattedData = formattedData.reverse();
      for (let data of formattedData) {
        chartData.push(data);
      }
    
     let options = {
      title: 'Mars Weather Data',
      curveType: 'function',
      legend: { position: 'bottom' },
      backgroundColor: 'white',
      hAxis:{
        title: 'Sols',
        
      },
      vAxis :
      { title:'Temp(Celsius)'},
       

     }
      let finalData = google.visualization.arrayToDataTable(chartData);
      let chart = new google.visualization.LineChart(
        document.getElementById("curve_chart")
      );

      chart.draw(finalData,options)
    };

    
  });

