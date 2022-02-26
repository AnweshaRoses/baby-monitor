class Microphone{
    constructor(){
        this.initialized=false;
        navigator.mediaDevices.getUserMedia({audio:true})
        .then(function(stream){
            this.audioContext=new AudioContext();
            this.microphone=this.audioContext.createMediaStreamSource(stream);
            this.analyser=this.audioContext.createAnalyser();
            this.analyser.fftSize=512;
            const bufferLength=this.analyser.frequencyBinCount;
            this.dataArray=new Uint8Array(bufferLength);
            this.microphone.connect(this.analyser);
            this.initialized=true;
        }.bind(this)).catch(function(e){
            alert(e)
        });
    }
    getVolume(){
        this.analyser.getByteTimeDomainData(this.dataArray);
        let normSamples=[...this.dataArray].map(e=>e/128 - 1);
        let sum=0;
        for(let i=0;i<normSamples.length;i++){
            sum+=normSamples[i] **2;
        }
        let volume=Math.sqrt(sum/normSamples.length);
        return volume
    }
}

let intervalFiveSec;
let interval50ms;
let spikesIn5Sec=0
let audioFile=null;

function getTimeObj(){
    const datetimeNow=new Date()
    return {
        year:datetimeNow.getFullYear(),
        month:datetimeNow.getMonth()+1,
        date:datetimeNow.getDate(),
        hour:datetimeNow.getHours(),
        minute:datetimeNow.getMinutes(),
    }
}


//event handler for clicking MONITOR Button
function monitorBaby(){
    intervalFiveSec=setInterval(()=>{
        if(spikesIn5Sec>7){
            calmTheBaby()
            clearInterval(intervalFiveSec)
            clearInterval(interval50ms)
        }
        spikesIn5Sec=0
    },5000)


    let myMic=new Microphone()
    setTimeout(()=>{
    interval50ms=setInterval(()=>{
        let vol=myMic.getVolume()
        if(vol>0.09){
//            console.log("spike in volume")
            spikesIn5Sec+=1    
        };
    },50)},1000)
}

function calmTheBaby(){
//    play audio
console.log("shhhhhh shhh shhhhh....")
    audioFile=new Audio("lullaby.mp3")
    audioFile.play()

const postBabyCryObj=getTimeObj()
postBabyCryObj.crying=true;
fetch("/baby-is-crying", {
  method: "POST",
  body: JSON.stringify(postBabyCryObj),
  headers: { "Content-Type": "application/json" }
})

}

function unmonitorBaby(){
    spikesIn5Sec=0
    clearInterval(intervalFiveSec)
    clearInterval(interval50ms)
    // audioFile.pause()
//    stop the music
}











