const  Plotly  = require('plotly.js-dist')
const fs = require('node:fs')
const $ = require('jquery')

const CORLOR_PEAK = '#A81EED'
const CORLOR_QPEAK = '#DAA520'
const CORLOR_AVG = '#FF7733'



function readCsv(file,coding){
    //convert csv file to 2d array
    let data = fs.readFileSync(file,coding).split('\r\n');
    data.forEach((element,index)=>{data[index] = element.split(',')});
    return data;
}

function linesGen(data,level,catgory,LINECORLOR){
    //convert 2d array to lines data
    //level: class5,class4,class3,class2,class1
    //catgory: peak,qpeak,avg
    //LINECORLOR: corlor
    let lines = [];
    const levelList = data[0];
    const catgoryList = ['peak','qpeak','avg'];
    col = levelList.indexOf(level) + catgoryList.indexOf(catgory);
    for (let i=2;i<data.length;i=i+1){
        lines.push({
                    x:[data[i][0],data[i][1]],
                    y:[data[i][col],data[i][col]],
                    //trace setting
                    //mode:'lines',
                    line:{color:LINECORLOR},
                    showlegend:false,
                    hoverinfo:'x+y',
        });
    }
    return lines;
}

dataCE2016 = readCsv('./src/data/ce2016.csv','utf-8');
dataRE2016 = readCsv('./src/data/re2016.csv','utf-8');
dataCE2021 = readCsv('./src/data/ce2021.csv','utf-8');
dataRE2021 = readCsv('./src/data/re2021.csv','utf-8');

const layoutCE = {
    title:'CE-CP @ CISPR-25',
    xaxis: {
        range: [0,250]
    },
    yaxis: {
        title:'dBuA',
        range:[-30,30]
    }};
const layoutRE = {
    title:'RE-ALSE @ CISPR-25',
    xaxis: {
        range: [0,250]
    },
    yaxis: {
        title:'dBuV/m',
        range:[-20,60]
    }}; 
const config = {
    responsive:true,
    displaylogo: false    
};   

let holdCELines = [];
let holdRELines = [];
function redraw(){
    let dataCE = [];
    let dataRE = [];
    if($('#version_manual')[0].value == 'v2016'){
        dataCE = dataCE2016;
        dataRE = dataRE2016;
    }
    else if($('#version_manual')[0].value == 'v2021'){
        dataCE = dataCE2021;
        dataRE = dataRE2021;
    }
    let level = $('#level')[0].value;
    let linesCE = [];
    let linesRE = [];
    if($('#peak')[0].checked){
        linesCE = linesCE.concat(linesGen(dataCE,level,'peak',CORLOR_PEAK));
        linesRE = linesRE.concat(linesGen(dataRE,level,'peak',CORLOR_PEAK));
    }
    if($('#qpeak')[0].checked){
        linesCE = linesCE.concat(linesGen(dataCE,level,'qpeak',CORLOR_QPEAK));
        linesRE = linesRE.concat(linesGen(dataRE,level,'qpeak',CORLOR_QPEAK));
    }
    if($('#average')[0].checked){
        linesCE = linesCE.concat(linesGen(dataCE,level,'avg',CORLOR_AVG));
        linesRE = linesRE.concat(linesGen(dataRE,level,'avg',CORLOR_AVG));
    }
    //
    if($('#hold')[0].checked){
        linesCE = linesCE.concat(holdCELines);
        linesRE = linesRE.concat(holdRELines);
    }
    holdCELines = linesCE;
    holdRELines = linesRE;
    //
    Plotly.newPlot('plotce',linesCE,layoutCE,config);
    Plotly.newPlot('plotre',linesRE,layoutRE,config);

}

redraw();
$('#version_manual').on('change',redraw);
$('#level').on('change',redraw);
$('#peak').on('change',redraw);
$('#qpeak').on('change',redraw);
$('#average').on('change',redraw);


