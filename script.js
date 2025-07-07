  console.log("Lets write some JavaScript")

    let currentSong = new Audio() ;
     let songs;
     let currFolder;

    // function to convert seconds to minutes 

    function secondsToMinutesSeconds(seconds){

        if(isNaN (seconds) || seconds < 0){
            return "00:00 ";
        }
        const minutes = Math.floor(seconds/60);
        const remainingSeconds = Math.floor(seconds % 60);

        const formattedMinutes = String(minutes).padStart(2,'0');
        const formattedSeconds = String(remainingSeconds).padStart(2,'0');

        return `${formattedMinutes} : ${formattedSeconds}`


    }
    // changed from here 
async function getSongs(folder) {
    currFolder = folder;

    try {
        let res = await fetch(`${folder}/info.json`);
        if (!res.ok) throw new Error(`info.json not found in ${folder}`);
        let data = await res.json();

        songs = data.songs || [];

        // Show all the songs in the playlist
        let songUL = document.querySelector(".songList ul");
        songUL.innerHTML = "";

        for (const song of songs) {
            songUL.innerHTML += `
            <li>
                <img src="Img/music.svg" alt="" class="invert">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Anime</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img src="Img/play.svg" alt="playbutton">
                </div>
            </li>`;
        }

        // Add event listener to each song
        Array.from(document.querySelectorAll(".songList li")).forEach((e) => {
            e.addEventListener("click", () => {
                let songName = e.querySelector(".info").firstElementChild.innerText.trim();
                playMusic(songName);
            });
        });

        return songs;
    } catch (err) {
        console.error("Failed to load songs from info.json:", err);
        return [];
    }
}


// till here 

const playMusic = (track , pause = false) =>{
    
    // currentSong.src = "/Songs/" + track + ".mp3"
    currentSong.src = `${currFolder}/` + track 
    // currentSong.load();

    if(!pause){

        currentSong.play()
        play.src = "Img/pause.svg"
        
    }
   
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


  
}

async function displayAlbums (){

// let a = await fetch(`http://192.168.56.91:5500/Songs/`)
let a = await fetch(`Songs/`)
let response = await a.text()
let div = document.createElement("div")
div.innerHTML = response;
let anchors = div.getElementsByTagName("a")

let cardContainer = document.querySelector(".cardContainer")



// chatgpt start
let array = Array.from(anchors);

for (let i = 0; i < array.length; i++) {
    const e = array[i];

    if (e.href.includes("/Songs")) {
        let folder = decodeURIComponent(
            // e.getAttribute("href").replace("/Songs/", "").replace("/", "")
             e.getAttribute("href").replace("Songs/", "").replace("/", "")
        );

        try {
            // let res = await fetch(`http://192.168.56.91:5500/Songs/${folder}/info.json`);
            let res = await fetch(`Songs/${folder}/info.json`);
            if (!res.ok) throw new Error(`info.json not found for folder: ${folder}`);
            let response = await res.json();
            console.log(response);

            cardContainer.innerHTML += `
            <div data-folder="${folder}" class="card">
                <div class="play">
                    <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512">
                        <circle fill="#01A437" cx="256" cy="256" r="256"/>
                        <path fill="#42C76E" d="M256 9.28c136.12 0 246.46 110.35 246.46 246.46 0 3.22-.08 6.42-.21 9.62C497.2 133.7 388.89 28.51 256 28.51S14.8 133.7 9.75 265.36c-.13-3.2-.21-6.4-.21-9.62C9.54 119.63 119.88 9.28 256 9.28z"/>
                        <path fill="#fff" d="M351.74 275.46c17.09-11.03 17.04-23.32 0-33.09l-133.52-97.7c-13.92-8.73-28.44-3.6-28.05 14.57l.54 191.94c1.2 19.71 12.44 25.12 29.04 16l131.99-91.72z"/>
                    </svg>
                </div>
                <img src="Songs/${folder}/cover.jpg" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`;
        } catch (err) {
            console.error("Failed to load album for", folder, err);
        }
    }
}

// chatgpt end 

   // Load the playlist whenever the card is Clicked 
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item =>{
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            
        })
    })

}

async function main(){



    

    // Get the list of all songs 
     await getSongs("Songs/ncs")

    playMusic(songs[0],true)
    // console.log(songs)

//    Display all Albums on the page 
   
displayAlbums();





   // Attach an event listener to play and previous 

   play.addEventListener("click", ()=>{

    if(currentSong.paused){
        currentSong.play()
        play.src= "Img/pause.svg"
    }
    else{
        
        play.src = "Img/play.svg"
        currentSong.pause()
    }


   })

   // Listen for Time Update event 

   currentSong.addEventListener("timeupdate", ()=>{
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100  + "%";
   })

   // Adding event Listener to seekbar 
   document.querySelector(".seekbar").addEventListener("click" , e=>{

    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100 ;

    document.querySelector(".circle").style.left = percent + "%";

    currentSong.currentTime = ((currentSong.duration) * percent) /100 

   })


   // Add an EventListener  for hamburger 

   document.querySelector(".hamburger").addEventListener("click" , ()=>{
    document.querySelector(".left").style.left = "0";
    document.querySelector(".hamburger").style.opacity="0";
   })
  
    // Add an EventListerner for Close button 
    document.querySelector(".close").addEventListener("click" , ()=>{
    document.querySelector(".left").style.left = "-200%";
      document.querySelector(".hamburger").style.opacity="1";
   })


   // Add an EventListener to Previous  button
    previous.addEventListener("click", ()=>{

          let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
     if((index - 1 >= 0)){
        playMusic(songs[index-1])
     }

    })

    // Add an EventListener to Next button 
     next.addEventListener("click", ()=>{
     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
     if((index + 1 < songs.length)){
        playMusic(songs[index+1])
     }
    })

    // Add and Event to Volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{

        currentSong.volume= parseInt(e.target.value)/100

    })


    // Add an Event listener to Mute the track 
    
    document.querySelector(".volume>img").addEventListener("click", e=>{
        console.log(e.target)

        if(e.target.src.includes("volume.svg") ){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = .10;
             document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }
    })



}




main()





