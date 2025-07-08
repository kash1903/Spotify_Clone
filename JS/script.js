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
            <div class="info">
            <img src="Img/music1.svg" alt="" >
                    <div class = "text">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Anime</div>
                    </div>
                </div>
                <div class="playnow">
                    
                    <img src="Img/play.svg" alt="playbutton" class= "hover-play">
                </div>
            </li>`;
        }

        // Add event listener to each song
        Array.from(document.querySelectorAll(".songList li")).forEach((e) => {
            e.addEventListener("click", () => {
                const namediv= e.querySelector(".info .text div")

                if(namediv){

                    // let songName = e.querySelector(".info .text div").firstElementChild.innerText.trim();
                    let songName = namediv.innerText.trim();
                    playMusic(songName);
                }
                else{
                    console.log("song name was not found  in clicked item")
                }
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

// from here chatgpt -------------------------->
async function displayAlbums() {
    try {
        // Fetch the static list of album folders
        let res = await fetch("Albums.json");
        if (!res.ok) throw new Error("Failed to fetch Albums.json");

        let albumData = await res.json();
        let albumList = albumData.Albums;

        let cardContainer = document.querySelector(".cardContainer");
        cardContainer.innerHTML = "";

        for (let folder of albumList) {
            try {
                let infoRes = await fetch(`Songs/${folder}/info.json`);
                if (!infoRes.ok) throw new Error(`info.json not found for ${folder}`);

                let info = await infoRes.json();

                cardContainer.innerHTML += `
                <div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512">
                            <circle fill="#01A437" cx="256" cy="256" r="256"/>
                            <path fill="#42C76E" d="M256 9.28c136.12 0 246.46 110.35 246.46 246.46 0 3.22-.08 6.42-.21 9.62C497.2 133.7 388.89 28.51 256 28.51S14.8 133.7 9.75 265.36c-.13-3.2-.21-6.4-.21-9.62C9.54 119.63 119.88 9.28 256 9.28z"/>
                            <path fill="#fff" d="M351.74 275.46c17.09-11.03 17.04-23.32 0-33.09l-133.52-97.7c-13.92-8.73-28.44-3.6-28.05 14.57l.54 191.94c1.2 19.71 12.44 25.12 29.04 16l131.99-91.72z"/>
                        </svg>
                    </div>
                    <img src="Songs/${folder}/cover.jpg" alt="${info.title}">
                    <h2>${info.title}</h2>
                    <p>${info.description}</p>
                </div>`;
            } catch (err) {
                console.error(`Error loading info for ${folder}`, err);
            }
        }

        // Card click event to load songs
        Array.from(document.getElementsByClassName("card")).forEach(card => {
            card.addEventListener("click", async () => {
                songs = await getSongs(`Songs/${card.dataset.folder}`);
                playMusic(songs[0]);
            });
        });

    } catch (err) {
        console.error("Error loading Albums.json", err);
    }
}


// till here ----------------------------------------------------------->

async function main(){



    

    // Get the list of all songs 
     await getSongs("Songs/All Songs")

    playMusic(songs[0],true)
    // console.log(songs)

//    Display all Albums on the page 
   
displayAlbums();

// redirction 

document.querySelector(".loginbtn").addEventListener("click", () => {
    window.location.href = "https://662e24aa9e2549a99eb300b6--chipper-speculoos-9379c1.netlify.app/";
});



// search feature here 
document.querySelector('li img[alt="search"]').parentElement.addEventListener("click", () => {
    const bar = document.querySelector(".searchBar");
    bar.style.display = bar.style.display === "none" ? "block" : "none";
});

// Add search filter
document.getElementById("searchInput").addEventListener("input", function () {
    const query = this.value.toLowerCase();

    let filteredSongs = songs.filter(song => decodeURIComponent(song).toLowerCase().includes(query));

    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";

    for (const song of filteredSongs) {
        songUL.innerHTML += `
            <li>
                <div class="info">
                    <img src="Img/music1.svg" alt="">
                    <div class="text">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>Anime</div>
                    </div>
                </div>
                <div class="playnow">
                    <img src="Img/play.svg" alt="playbutton" class="hover-play">
                </div>
            </li>`;
    }

    // Add back the click event to play songs
    Array.from(document.querySelectorAll(".songList li")).forEach((e) => {
        e.addEventListener("click", () => {
            const namediv = e.querySelector(".info .text div");
            if (namediv) {
                let songName = namediv.innerText.trim();
                playMusic(songName);
            }
        });
    });
});

// end here 





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

    // previous.addEventListener("click", ()=>{

    //       let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    //  if((index - 1 >= 0)){
    //     playMusic(songs[index-1])
    //  }

    // })

    // chatgpt version of Previous button 
    previous.addEventListener("click", () => {
    let current = decodeURIComponent(currentSong.src.split("/").pop().split("?")[0]);
    let index = songs.indexOf(current);

    if (index !== -1 && index - 1 >= 0) {
        playMusic(songs[index - 1]);
    } else {
        console.warn("No previous song available or current not matched");
    }
});




    // Add an EventListener to Next button 
    //  next.addEventListener("click", ()=>{
    //  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    //  if((index + 1 < songs.length)){
    //     playMusic(songs[index+1])
    //  }
    // })


        // chatgpt version of Next button 

    next.addEventListener("click", () => {
    let current = decodeURIComponent(currentSong.src.split("/").pop().split("?")[0]);
    let index = songs.indexOf(current);
    
    if (index !== -1 && index + 1 < songs.length) {
        playMusic(songs[index + 1]);
    } else {
        console.warn("No next song available or current not matched");
    }
});

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


const voiceSearchBtn = document.getElementById("voiceSearchBtn");

// Check if browser supports speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    voiceSearchBtn.addEventListener("click", () => {
        recognition.start();
        voiceSearchBtn.innerText = "🎙️ Listening...";
    });

    recognition.onresult = (event) => {
        let voiceInput = event.results[0][0].transcript;
        voiceSearchBtn.innerText = "🎙️ AI ";

        console.log("You said:", voiceInput);

        const matchedSong = songs.find(song =>
            decodeURIComponent(song.toLowerCase()).includes(voiceInput.toLowerCase())
        );

        if (matchedSong) {
            playMusic(matchedSong);
        } else {
            alert(`Sorry, no matching song found for: "${voiceInput}"`);
        }
    };

    recognition.onerror = (err) => {
        console.error("Voice recognition error:", err);
        voiceSearchBtn.innerText = "🎙️ AI ";
    };
} else {
    voiceSearchBtn.disabled = true;
    voiceSearchBtn.innerText = "🎙️ Not Supported";
    alert("Your browser doesn't support voice recognition.");
}

document.getElementById("homeBtn").addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Smooth scroll effect
    });
});



main()





