document.getElementById("ddlitemslist").addEventListener("change", function(){filter()});
document.getElementById("next").addEventListener("click", function(){counter(1)});
document.getElementById("previous").addEventListener("click", function(){counter(-1)});
document.getElementById("searchbutton").addEventListener("click", function(){getsearchvalue()});

var indexx=1;
var dataAfterstore = JSON.parse(localStorage.getItem('corona'));
var filetercreteria = '';

lcs = (searchvalue, countryname, searchvaluesize, countrynamesize)=>{
  var x = new Array(searchvaluesize + 1);
    for (var i = 0; i < x.length; i++) {
         x[i] = new Array(countrynamesize + 1);
       }
    for (var i = 0; i <= searchvaluesize; i++){
        for (var j = 0; j <= countrynamesize; j++){
        if (i == 0 || j == 0)
            x[i][j] = 0;

        else if (searchvalue[i - 1] == countryname[j - 1])
            x[i][j] = x[i - 1][j - 1] + 1;

        else
            x[i][j] = Math.max(x[i - 1][j], x[i][j - 1]);
        }
    }
    return x[searchvaluesize][countrynamesize];
}

getsearchvalue = () =>{
  var searchvalue = document.getElementById("searchinput").value;
  var index = -1;
  var maxi = 0;
  for(var i=0; i<dataAfterstore.length; i++){
      if(searchvalue.toLowerCase()===dataAfterstore[i].country.toLowerCase()){
        index = i;
        break;
      }else{
      var yy = lcs(searchvalue.toLowerCase(), dataAfterstore[i].country.toLowerCase(), searchvalue.length, dataAfterstore[i].country.length);
      if(yy > maxi){
        maxi = yy;
        index = i;
      }
    }
  }
  if(maxi<=0){
    alert('cant find your result');
  }else{
    calllpie(index);
  }
}

window.onload = function(){
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = 'https://corona.lmao.ninja/countries';
  fetch(proxyurl + url)
    .then((resp) => resp.json())
    .then(function(data) {
      //addData(data, indexx);
      localStorage.setItem('corona', JSON.stringify(data));
    })
    .catch(function(error) {
      console.log(error);
    });
  document.getElementById("previous").disabled = indexx<=1 ? true : false;
  filetercreteria = "cases";
  calll(1, filetercreteria);
  calllpie(0);
}

calllpie = (index) =>{
  var dataPoints1 = [];
  var chart1 = new CanvasJS.Chart("chartContainer1", {
  	animationEnabled: true,
    theme: "dark2", // "light1", "light2", "dark1", "dark2"
  	title: {
  		text: dataAfterstore[index].country
  	},
  	data: [{
  		type: "pie",
  		startAngle: 240,
  		yValueFormatString: "##0\"\"",
  		indexLabel: "{label} {y}",
  		dataPoints: dataPoints1
  	}]
  });

  function addData1() {
    dataPoints1.push({
      y: dataAfterstore[index].cases,
      label: "cases:"
    });
    dataPoints1.push({
      y: dataAfterstore[index].todayCases,
      label: "todayCases:"
    });
    dataPoints1.push({
      y: dataAfterstore[index].deaths,
      label: "deaths:"
    });
    dataPoints1.push({
      y: dataAfterstore[index].todayDeaths,
      label: "todayDeaths:"
    });
    dataPoints1.push({
      y: dataAfterstore[index].recovered,
      label: "recovered:"
    });
    dataPoints1.push({
      y: dataAfterstore[index].active,
      label: "active:"
    });
    dataPoints1.push({
      y: dataAfterstore[index].critical,
      label: "critical:"
    });
    chart1.render();
  }

  addData1();

}

calll = (indexx, filetercreteria)=>{
  var dataPoints = [];
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "dark2", // "light1", "light2", "dark1", "dark2"
    title:{
      text: 'Total Corona ' + filetercreteria  + ' Country wise'
    },
    axisY: {
      title: filetercreteria,
      titleFontColor: "#4F81BC",
      lineColor: "#4F81BC",
      labelFontColor: "#4F81BC",
      tickColor: "#4F81BC"
    },
    toolTip: {
      shared: true
    },
    data: [{
      type: "column",
      name: filetercreteria,
      legendText: filetercreteria,
      showInLegend: true,
      dataPoints: dataPoints
    }]
  });

  const paginate = function (array, index, size) {
            index = Math.abs(parseInt(index));
            index = index > 0 ? index - 1 : index;
            size = parseInt(size);
            size = size < 1 ? 1 : size;
            return [...(array.filter((value, n) => {
                return (n >= (index * size)) && (n < ((index+1) * size))
            }))]
  }

   function addData(data, value) {
    var transform = paginate(data, value, 10);
  	for (var i = 0; i < transform.length; i++) {
  		dataPoints.push({
  			y: transform[i][filetercreteria],
        label: transform[i].country
  		});
  	}
    chart.render();
  }

  addData(dataAfterstore, indexx);

}

counter = (value)=>{
  indexx = indexx + value;
  document.getElementById("previous").disabled = indexx<=1 ? true : false;
  size =  parseInt((dataAfterstore.length)/10);
  checksz = size*10==dataAfterstore.length ? size : size +1;
  document.getElementById("next").disabled = indexx>=checksz ? true : false;
  calll(indexx, filetercreteria) ;
}

var ddlItems = document.getElementById("ddlitemslist"),
itemArray = ["cases", "todayCases", "deaths", "todayDeaths", "recovered", "active"];
    for (var i = 0; i < itemArray.length; i++) {
      var opt = itemArray[i];
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      ddlItems.appendChild(el);
}

filter = () =>{
  filetercreteria = document.getElementById('ddlitemslist').value;
  calll(indexx, filetercreteria);
}
