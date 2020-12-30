/*

How to add a new project:
1. Add a new project element in the corresponding html file.
2. Add English text in writeEnglish().
3. Add Korean text in writeKorean().
4. Create a new html file in the corresponding folder.
5. Link to this file in the corresponding html element.
6. Add description in this new file using the template file.
*. If adding a project to the cave, then ensure to increment the number of total projects in that branch (in writeEnglish() function).

*/

// Get box open/close state
var boxOpen = sessionStorage.getItem("boxOpen");
if(boxOpen != "true" && boxOpen != "false") {
    sessionStorage.setItem("boxOpen", "false");
    boxOpen = "false";
}

// Get other data across page
var fileName = window.location.pathname.split("/").pop();
initializeElements();
initializeText();

// Keep scroll
let scroll = sessionStorage.getItem("scroll");
let maxScroll = window.innerHeight + 29;
if(scroll > maxScroll)
    window.scrollTo(window.scrollX, maxScroll);
else window.scrollTo(window.scrollX, scroll);

var canvas = document.getElementById("dragonflyArea");
var context = canvas.getContext("2d");

var dragonflies = [];
let parsedDragonflies = JSON.parse(sessionStorage.getItem("dragonflies"));
if(parsedDragonflies == null) {
    dragonflies.push(
        new Dragonfly(100, 100, 0, 0, 0, 1, "right", false, "flying", 0));
} else {
    parsedDragonflies.every(d => {
        dragonflies.push(new Dragonfly(d.x, d.y, d.xv, d.yv, d.tick, d.state,
                                       d.direction, d.isGone, d.action,
                                       d.actionDuration));
        return true;
    });
}

var flies = [];
let parsedFlies = JSON.parse(sessionStorage.getItem("flies"));
if(parsedFlies != null) {
    parsedFlies.every(f => {
        flies.push(new Fly(f.x, f.y, f.xv, f.yv, f.tick, f.state,
                                       f.direction, f.isDead, f.action,
                                       f.actionDuration));
        return true;
    });
}

requestAnimationFrame(updateDragonfly);

//////////////////////////////////////////////////////////////////////

window.addEventListener("beforeunload", function() {
    sessionStorage.setItem("scroll", window.scrollY);
    sessionStorage.setItem("dragonflies", JSON.stringify(dragonflies));
    sessionStorage.setItem("flies", JSON.stringify(flies));
    sessionStorage.setItem("boxOpen", boxOpen);
});

window.addEventListener("resize", function() {
    adjustSize();
});

function initializeElements() {
    
    adjustSize();
    
    switch(fileName) {
            
        case "about.html":
            let lv = Number(sessionStorage.getItem("aboutRevealLv"));
            if(lv >= 1) aboutRevealAppend(1);
            if(lv >= 2) aboutRevealAppend(2);
            if(lv >= 3) aboutRevealAppend(3);
            if(lv >= 4) aboutRevealAppend(4);
            if(lv >= 5) aboutRevealAppend(5);
            if(lv >= 6) aboutRevealAppend(6);
            break;
            
    }
    
    if(boxOpen == "true") {
        document.getElementById("flyBtn").style.visibility = "visible";
        document.getElementById("dragonflyBtn").style.visibility = "visible";
        document.getElementById("catchBtn").style.visibility = "visible";

        let img = document.getElementById("boxBtnImg");
        img.setAttribute("src", "../images/box_open.png");

    } else {
        document.getElementById("flyBtn").style.visibility = "hidden";
        document.getElementById("dragonflyBtn").style.visibility = "hidden";
        document.getElementById("catchBtn").style.visibility = "hidden";

        let img = document.getElementById("boxBtnImg");
        img.setAttribute("src", "../images/box_closed.png");
    }
}

function initializeText() {
    if(sessionStorage.getItem("language") == null) {
        writeEnglish();
        sessionStorage.setItem("language", "english");
        location.reload();
    }
    else if(sessionStorage.getItem("language") == "korean")
        writeKorean();
    else writeEnglish();
}

function swapLanguage() {
    if(sessionStorage.getItem("language") == "english") {
        sessionStorage.setItem("language", "korean");
        writeKorean(window.location.pathname.split("/").pop());
    } else {
        sessionStorage.setItem("language", "english");
        initializeText();
    }
}

function aboutReveal() {
    
    document.getElementById("revealBtn").disabled = true;
    
    if(sessionStorage.getItem("aboutRevealLv") == null)
        sessionStorage.setItem("aboutRevealLv", 1);
    else sessionStorage.setItem("aboutRevealLv",
                              Number(sessionStorage.getItem("aboutRevealLv"))+1);
    
    let lv = Number(sessionStorage.getItem("aboutRevealLv"));
    let isKor = sessionStorage.getItem("language") == "korean";
    switch(lv) {
        case 1: // education, occupation, etc.
            if(isKor)
                document.getElementById("revealBtn").innerHTML = "네.";
            else
                document.getElementById("revealBtn").innerHTML = "Sure.";
            break;
        case 2: // favorite color, animal, season, food, etc.
            if(isKor)
                document.getElementById("revealBtn").innerHTML = "음... 네.";
            else
                document.getElementById("revealBtn").innerHTML = "Uhh okay.";
            break;
        case 3: // top 3 favorite countries, movies, ionic compounds, etc.
            if(isKor)
                document.getElementById("revealBtn").innerHTML = "이보다 더요?";
            else
                document.getElementById("revealBtn").innerHTML = "Even more?";
            break;
        case 4: // specie, breed, phenotype, etc.
            if(isKor)
                document.getElementById("revealBtn").innerHTML = "이정도면 된거같은데...";
            else
                document.getElementById("revealBtn").innerHTML = "Still got questions?";
            break;
        case 5:
            if(isKor)
                document.getElementById("revealBtn").innerHTML = "더는 그만.";
            else
                document.getElementById("revealBtn").innerHTML = "That's enough.";
            break;
        case 6: // mbti
            if(isKor)
                document.getElementById("revealBtn").innerHTML = "아 이걸 놓쳤구나.";
            else
                document.getElementById("revealBtn").innerHTML = "Oh, I guess I missed a few.";
            break;
        case 7:
            if(isKor)
                document.getElementById("revealBtn").innerHTML = "이제 진짜 그만.";
            else
                document.getElementById("revealBtn").innerHTML = "No more.";
            break;
        case 8:
            if(isKor)
                document.getElementById("revealBtn").innerHTML = "정말로 끝.";
            else
                document.getElementById("revealBtn").innerHTML = "Shoo.";
            break;
        default:
            document.getElementById("revealBtn").innerHTML = "...";
    }
    
    setTimeout(function() {
        aboutRevealAppend(lv);
        initializeText();
        document.getElementById("revealBtn").disabled = false;    
    }, 2000);
}

function aboutRevealAppend(lv) {
    
    switch(lv) {
            
        case 1:
            var li0 = document.createElement("LI");
            li0.setAttribute("id", "list1-0");
            li0.setAttribute("style", "margin-top: 15px");
            var li1 = document.createElement("LI");
            li1.setAttribute("id", "list1-1");
            var li2 = document.createElement("LI");
            li2.setAttribute("id", "list1-2");
            var li3 = document.createElement("LI");
            li3.setAttribute("id", "list1-3");
            
            var btn = document.getElementById("revealBtn");
            document.getElementById("content").removeChild(btn);
            document.getElementById("content").appendChild(li0);
            document.getElementById("content").appendChild(li1);
            document.getElementById("content").appendChild(li2);
            document.getElementById("content").appendChild(li3);
            document.getElementById("content").appendChild(btn);
            break;
            
        case 2:
            var li0 = document.createElement("LI");
            li0.setAttribute("id", "list2-0");
            li0.setAttribute("style", "margin-top: 15px");
            var li1 = document.createElement("LI");
            li1.setAttribute("id", "list2-1");
            var li2 = document.createElement("LI");
            li2.setAttribute("id", "list2-2");
            var li3 = document.createElement("LI");
            li3.setAttribute("id", "list2-3");
            var li4 = document.createElement("LI");
            li4.setAttribute("id", "list2-4");
            
            var btn = document.getElementById("revealBtn");
            document.getElementById("content").removeChild(btn);
            document.getElementById("content").appendChild(li0);
            document.getElementById("content").appendChild(li1);
            document.getElementById("content").appendChild(li2);
            document.getElementById("content").appendChild(li3);
            document.getElementById("content").appendChild(li4);
            document.getElementById("content").appendChild(btn);
            break;
            
        case 3:
            var li0 = document.createElement("LI");
            li0.setAttribute("id", "list3-0");
            li0.setAttribute("style", "margin-top: 15px");
            var li1 = document.createElement("LI");
            li1.setAttribute("id", "list3-1");
            var li2 = document.createElement("LI");
            li2.setAttribute("id", "list3-2");
            var li3 = document.createElement("LI");
            li3.setAttribute("id", "list3-3");
            var li4 = document.createElement("LI");
            li4.setAttribute("id", "list3-4");
            var li5 = document.createElement("LI");
            li5.setAttribute("id", "list3-5");
            var li6 = document.createElement("LI");
            li6.setAttribute("id", "list3-6");
            var li7 = document.createElement("LI");
            li7.setAttribute("id", "list3-7");
            
            var btn = document.getElementById("revealBtn");
            document.getElementById("content").removeChild(btn);
            document.getElementById("content").appendChild(li0);
            document.getElementById("content").appendChild(li1);
            document.getElementById("content").appendChild(li2);
            document.getElementById("content").appendChild(li3);
            document.getElementById("content").appendChild(li4);
            document.getElementById("content").appendChild(li5);
            document.getElementById("content").appendChild(li6);
            document.getElementById("content").appendChild(li7);
            document.getElementById("content").appendChild(btn);
            break;
            
        case 4:
            var li0 = document.createElement("LI");
            li0.setAttribute("id", "list4-0");
            li0.setAttribute("style", "margin-top: 15px");
            var li1 = document.createElement("LI");
            li1.setAttribute("id", "list4-1");
            var li2 = document.createElement("LI");
            li2.setAttribute("id", "list4-2");
            var li3 = document.createElement("LI");
            li3.setAttribute("id", "list4-3");
            var li4 = document.createElement("LI");
            li4.setAttribute("id", "list4-4");
            var li5 = document.createElement("LI");
            li5.setAttribute("id", "list4-5");
            var li6 = document.createElement("LI");
            li6.setAttribute("id", "list4-6");
            var li7 = document.createElement("LI");
            li7.setAttribute("id", "list4-7");    
            
            var btn = document.getElementById("revealBtn");
            document.getElementById("content").removeChild(btn);
            document.getElementById("content").appendChild(li0);
            document.getElementById("content").appendChild(li1);
            document.getElementById("content").appendChild(li2);
            document.getElementById("content").appendChild(li3);
            document.getElementById("content").appendChild(li4);
            document.getElementById("content").appendChild(li5);
            document.getElementById("content").appendChild(li6);
            document.getElementById("content").appendChild(li7);
            document.getElementById("content").appendChild(btn);
            break;
            
        case 6:
            var li0 = document.createElement("LI");
            li0.setAttribute("id", "list6-0");
            li0.setAttribute("style", "margin-top: 15px");
            var li1 = document.createElement("LI");
            li1.setAttribute("id", "list6-1");
            var li2 = document.createElement("LI");
            li2.setAttribute("id", "list6-2");
            var li3 = document.createElement("LI");
            li3.setAttribute("id", "list6-3");
            var li4 = document.createElement("LI");
            li4.setAttribute("id", "list6-4");
            var li5 = document.createElement("LI");
            li5.setAttribute("id", "list6-5");
            var li6 = document.createElement("LI");
            li6.setAttribute("id", "list6-6");
            
            var btn = document.getElementById("revealBtn");
            document.getElementById("content").removeChild(btn);
            document.getElementById("content").appendChild(li0);
            document.getElementById("content").appendChild(li1);
            document.getElementById("content").appendChild(li2);
            document.getElementById("content").appendChild(li3);
            document.getElementById("content").appendChild(li4);
            document.getElementById("content").appendChild(li5);
            document.getElementById("content").appendChild(li6);
            document.getElementById("content").appendChild(btn);
            break;
    }
}

function adjustSize() {
    if(document.getElementById("projects") != null) {
        let whRatio = window.innerWidth / window.innerHeight;
        document.getElementById("projects")
            .setAttribute("style", "column-count:" + Math.ceil(whRatio/0.5));
    }
    
    let conH = window.innerHeight-document.getElementById("menu").offsetHeight*3-10;
    document.getElementById("content")
        .setAttribute("style", "min-height: " + conH + "px");
}

function writeEnglish() {

    if(fileName == "index.html") {
        document.getElementById("text01").innerHTML = 
            "Hello, and welcome to my website.";
        document.getElementById("text02").innerHTML = 
            "My name is Kyounghan (Kevin) Min, also known as Kevin1031; I'd say I prefer the name Kevin or Kevin1031. <br> If you wanted to see my portfolio as an employer of some sort, you came to the wrong place. If you just wanted to check out some cool lichens, you came to the right place.";
        document.getElementById("tranBtn").innerHTML =
            "한국어로";
        
        document.getElementById("text03").innerHTML =
            "Featured Items:"
        
        document.getElementById("feat01a").innerHTML =
            "[Garage] DynSky - Dynamic Image Clock";
        document.getElementById("feat01s").innerHTML =
            "Work In Progress (40%), Started: October 2020";
        document.getElementById("feat01t").innerHTML =
            "The DynSky is a unique clock in that it displays time through an image of a land/skyscape. These images are completely procedurally generated and updates in real-time, based on local weather and other notable events such as eclipses and comets. Instead of a realistic look, an art style similar to cartoon or anime will be used, alongside several experimental rendering methods which will theoretically be more efficient than conventional raycasting/tracing. The challenge is to create a 1500px by 1000px dynamic image with at most 4GB RAM CPU and without a GPU, while maintaining at least 10 FPS.";
        
        document.getElementById("feat02a").innerHTML =
            "[Cave/Video Games] Exponentiation Bubbles";
        document.getElementById("feat02s").innerHTML =
            "December 2020";
        document.getElementById("feat02t").innerHTML =
            "A \"Write a Game In 24 Hours Challenge\" I have done while I was sick, using a language I barely know (Javascript). In this game, the player is required to pop bubbles with a gun while dodging them. Popping a bubble splits it into two smaller bubbles, and popping all of them will allow the player to progress to the next level with larger bubbles. Popping bubbles and level progression provides coins, which can be used for various upgrades.";
        document.getElementById("feat02r").innerHTML =
            "Play game";
    }
    
    else if(fileName == "about.html") {
        document.getElementById("text01").innerHTML = 
            "A concise list about myself:";
        document.getElementById("list0-0").innerHTML = 
            "Names: 민경한 / Kyounghan Min / Kevin Min / Kevin1031";
        document.getElementById("list0-1").innerHTML =
            "Date of Birth: October 31st, 2000";
        document.getElementById("revealBtn").innerHTML =
            "More";

        let revealLv = Number(sessionStorage.getItem("aboutRevealLv"));
        if(revealLv >= 1) {
            document.getElementById("list1-0").innerHTML = 
                "Education Status: Studying for Bachelor's Degree in Computational Media";
            document.getElementById("list1-1").innerHTML =
                "Employment Status: Proudly Unemployed";
            document.getElementById("list1-2").innerHTML = 
                "High School: CCS -> TCIS";
            document.getElementById("list1-3").innerHTML =
                "College: University of Rochester -> Georgia Institute of Technology";
        }
        if(revealLv >= 2) {
            document.getElementById("list2-0").innerHTML = 
                "Favorite Color: Cyan / #00FFFF / RGB(0,255,255) / HSL(180,100,50) / CMYK(100,0,0,0)";
            document.getElementById("list2-1").innerHTML =
                "Favorite Season: Not Summer";
            document.getElementById("list2-2").innerHTML = 
                "Favorite Animal: Flemish Giant Rabbit (Oryctolagus cuniculus domesticus)";
            document.getElementById("list2-3").innerHTML =
                "Favorite Plant: Fan columbine (Aquilegia flabellata)";
            document.getElementById("list2-4").innerHTML =
                "Favorite Food: A Great Meal";
        }
        if(revealLv >= 3) {
            document.getElementById("list3-0").innerHTML = 
                "Top 3 Favorite Countries To Live In (descending order): South Korea, Japan, United States";
            document.getElementById("list3-1").innerHTML =
                "Top 3 Favorite Movies (descending order): Interstellar, Maze Runner, Terminator";
            document.getElementById("list3-2").innerHTML =
                "Top 3 Favorite Hobbies (descending order): Programming, Crafting/Drawing, Gaming";
            document.getElementById("list3-3").innerHTML = 
                "Superpower of Choice: Omnipotence";
            document.getElementById("list3-4").innerHTML =
                "Superpower of Choice (no godmode): Superluminal Speed";
            document.getElementById("list3-5").innerHTML =
                "Superpower of Choice (no godmode, physics enabled): Absolute AI Control";
            document.getElementById("list3-6").innerHTML =
                "Best Video Game of All Time: Minecraft";
            document.getElementById("list3-7").innerHTML =
                "Favorite Scholar: Alan Turing";
        }
        if(revealLv >= 4) {
            document.getElementById("list4-0").innerHTML = 
                "Favorite Ionic Compound: Ferrous Sulfate Heptahydrate";
            document.getElementById("list4-1").innerHTML =
                "Favorite Lichen: Cladonia pyxidata";
            document.getElementById("list4-2").innerHTML =
                "Favorite Data Structure: Hash Table";
            document.getElementById("list4-3").innerHTML =
                "Favorite Cloud: Cumulus congestus";
            document.getElementById("list4-4").innerHTML =
                "Second Favorite Positive Integer: 16";
            document.getElementById("list4-5").innerHTML =
                "Wisdon Teeth: 0";
            document.getElementById("list4-6").innerHTML =
                "Favorite Subatomic Particle: Positron";
            document.getElementById("list4-7").innerHTML = 
                "MBTI Result: 88%";
        }
        if(revealLv >= 6) {
            document.getElementById("list6-0").innerHTML = 
                "Favorite Celebrity: None";
            document.getElementById("list6-1").innerHTML = 
                "Favorite TV Show: None";
            document.getElementById("list6-2").innerHTML = 
                "Favorite Novel: None";
            document.getElementById("list6-3").innerHTML = 
                "Favorite Music: None";
            document.getElementById("list6-4").innerHTML = 
                "Favorite Webtoon: None";
            document.getElementById("list6-5").innerHTML = 
                "Dog or Cat: Rabbit";
            document.getElementById("list6-6").innerHTML = 
                "Role Model: None";
        }
        
    }
    
    else if(fileName == "garage.html") {
        document.getElementById("text01").innerHTML = 
            "Welcome to the Garage.";
        document.getElementById("text02").innerHTML = 
            "This is a collection of my work-in-progress or future projects. I don't even know if I can finish at least 10% of these.";
        
        document.getElementById("proj01a").innerHTML =
            "B-Tring (Pre-Alpha) - A Circular Rhythm Game";
        document.getElementById("proj01s").innerHTML =
            "On Pause (80%), Started: August 2018";
        document.getElementById("proj01t").innerHTML =
            "This rhythm game features a similar mechanic as other Guitar Hero style rhythm games, whereas instead of the \"notes\" raining down in a single direction, each \"column\" of \"notes\" branch off from a center, essentially resulting in a circular Guitar Hero. Doing so grants free movement of each \"columns\", allowing for much wider room for creative arrangement of each level.";
        
        document.getElementById("proj02a").innerHTML =
            "DynSky - Dynamic Image Clock";
        document.getElementById("proj02s").innerHTML =
            "Work In Progress (40%), Started: October 2020";
        document.getElementById("proj02t").innerHTML =
            "The DynSky is a unique clock in that it displays time through an image of a land/skyscape. These images are completely procedurally generated and updates in real-time, based on local weather and other notable events such as eclipses and comets. Instead of a realistic look, an art style similar to cartoon or anime will be used, alongside several experimental rendering methods which will theoretically be more efficient than conventional raycasting/tracing. The challenge is to create a 1500px by 1000px dynamic image with at most 4GB RAM CPU and without a GPU, while maintaining at least 10 FPS.";
        
        document.getElementById("proj03a").innerHTML =
            "Selectively Bred Cyan Morning Glory";
        document.getElementById("proj03s").innerHTML =
            "Work In Progress (??%), Started: 2009";
        document.getElementById("proj03t").innerHTML =
            "For this project, a wide variety of morning glory specimens will be collected for desired phenotypes, which will then be used to selectively breed a vibrant, cyan morning glory, which, to my knowledge, does not appear to exist yet.";
        
        document.getElementById("proj04a").innerHTML =
            "wutr sosig";
        document.getElementById("proj04s").innerHTML =
            "Future Project";
        document.getElementById("proj04t").innerHTML =
            "wutr sosig will be planted in a pot and basically be an indoor pond. fish and stuff will be there also.";
        
        document.getElementById("proj05a").innerHTML =
            "AFK Crystal Project";
        document.getElementById("proj05s").innerHTML =
            "Work In Progress (10%), Started: December 2020";
        document.getElementById("proj05t").innerHTML =
            "Various ionic compounds will be used to grow iron salt crystals. The goal is to reach a size of 10cm. Currently, Ammonium Ferrous Sulfate Dodecahydrate and Ferrous Sulfate Heptahydrate are being used.";
        
        document.getElementById("proj06a").innerHTML =
            "TLAAD: Terminal Low Altitude Area Defense";
        document.getElementById("proj06s").innerHTML =
            "Future Project";
        document.getElementById("proj06t").innerHTML =
            "A firearm mount which tracks humans or optionally any objects in motion and fires the mounted weapon when in range. The mount will also be capable of tracking objects which are in a trajectory toward itself, and when detected, firing an interceptor to disrupt its trajectory.";
        
        document.getElementById("proj07a").innerHTML =
            "Lithops Cultivation Project";
        document.getElementById("proj07s").innerHTML =
            "Work In Progress (5%), Started: September 2020";
        document.getElementById("proj07t").innerHTML =
            "Random varieties of lithops seeds are planted and will be grown in the following years to come. Notorious as one of the most difficult succulents to grow, I am essentially entering the succulent world in hardmode.";
        
        document.getElementById("proj08a").innerHTML =
            "Misty Forest Paludarium";
        document.getElementById("proj08s").innerHTML =
            "Future Project";
        document.getElementById("proj08t").innerHTML =
            "Perhaps with a massive tank of over 400L, a miniature version of the Southern Japanese forest will be recreated. Features include mossy trees and rocks, LED-lighted traditional cabins with a campfire, and a hot springs river flowing on the side. This will be a no-fauna setup.";
        
        document.getElementById("proj09a").innerHTML =
            "Popcoral Jukebox";
        document.getElementById("proj09s").innerHTML =
            "Future Project";
        document.getElementById("proj09t").innerHTML =
            "An Astroneer's Pre-Alpha Popcoral figurine music player which randomly plays background music in Astroneer.";
        
        document.getElementById("proj10a").innerHTML =
            "Orange Justice in a Box";
        document.getElementById("proj10s").innerHTML =
            "Future Project";
        document.getElementById("proj10t").innerHTML =
            "Displays a physical puppet performing Orange Justice when a music or some consistent beat is detected.";
        
        document.getElementById("proj11a").innerHTML =
            "Chaos Jukebox";
        document.getElementById("proj11s").innerHTML =
            "Future Project";
        document.getElementById("proj11t").innerHTML =
            "Plays randomly generated chaotic noises upon activation.";
        
        document.getElementById("proj12a").innerHTML =
            "Desktop Mobile Clock";
        document.getElementById("proj12s").innerHTML =
            "Future Project";
        document.getElementById("proj12t").innerHTML =
            "A rustic desktop mobile very similar to the project \"Mobile Clock v1.0\", but works and behaves exactly as a true analog clock. Essentially a Mobile Clock v2.0.";
        
        document.getElementById("proj13a").innerHTML =
            "Ball Python";
        document.getElementById("proj13s").innerHTML =
            "Future Project";
        document.getElementById("proj13t").innerHTML =
            "Successfully obtain and raise a ball python as a pet.";
        
        document.getElementById("proj14a").innerHTML =
            "Flemish Giant Rabbit";
        document.getElementById("proj14s").innerHTML =
            "Future Project";
        document.getElementById("proj14t").innerHTML =
            "Successfully obtain and raise a flemish giant rabbit as a pet.";
        
        document.getElementById("proj15a").innerHTML =
            "Macroevolution Simulator";
        document.getElementById("proj15s").innerHTML =
            "Future Project";
        document.getElementById("proj15t").innerHTML =
            "Create an optimized, visible computer simulation of virtual organisms reproducing, mutating, and undergoing evolution through natural selection. Instead of predetermining phenotypes such as speed, size, etc., raw sequences of genetic information will be used. These information will be the blueprint of creating protein molecules, becoming the building blocks of a single organism. Optionally, this simulation may be visually polished for real-time display, acting as a virtual terrarium.";
        
        document.getElementById("proj16a").innerHTML =
            "Mantis";
        document.getElementById("proj16s").innerHTML =
            "On Pause (30%)";
        document.getElementById("proj16t").innerHTML =
            "Successfully obtain a mantis egg pocket, raise, and breed.";
    }

    else if(fileName == "cave.html") {
        document.getElementById("text01").innerHTML = 
            "Welcome to the Cave.";
        document.getElementById("text02").innerHTML = 
            "This is a collection of my finished projects.";
        
        document.getElementById("cata01a").innerHTML =
            "Branch - Artmaking";
        document.getElementById("cata01s").innerHTML =
            "8 Projects";
        document.getElementById("cata01t").innerHTML =
            "My art-related creations. These only include projects that are done purely out of my own desire, not because it was a requirement as a part of some education or study.";
        
        document.getElementById("cata02a").innerHTML =
            "Branch - Astrophotography";
        document.getElementById("cata02s").innerHTML =
            "3 Projects";
        document.getElementById("cata02t").innerHTML =
            "Photos of stellar bodies taken by myself. My telescope sucks and I don't have a camera, so these photos are terrible.";
        
        document.getElementById("cata03a").innerHTML =
            "Branch - Computing";
        document.getElementById("cata03s").innerHTML =
            "3 Projects";
        document.getElementById("cata03t").innerHTML =
            "A group of purely computing projects. Video game-related projects have their own category.";
        
        document.getElementById("cata04a").innerHTML =
            "Branch - Engineering";
        document.getElementById("cata04s").innerHTML =
            "2 Projects";
        document.getElementById("cata04t").innerHTML =
            "Various projects which required aspects of engineering.";
        
        document.getElementById("cata05a").innerHTML =
            "Branch - Pets";
        document.getElementById("cata05s").innerHTML =
            "4 Projects";
        document.getElementById("cata05t").innerHTML =
            "Projects related to pets and petkeeping.";
        
        document.getElementById("cata06a").innerHTML =
            "Catogory - Plants";
        document.getElementById("cata06s").innerHTML =
            "5 Projects";
        document.getElementById("cata06t").innerHTML =
            "Projects related to plants, gardening, and no-fauna tank setups.";
        
        document.getElementById("cata07a").innerHTML =
            "Branch - Random";
        document.getElementById("cata07s").innerHTML =
            "3 Projects";
        document.getElementById("cata07t").innerHTML =
            "Pointless yet entertaining random projects.";
        
        document.getElementById("cata08a").innerHTML =
            "Branch - Video Games";
        document.getElementById("cata08s").innerHTML =
            "6 Projects";
        document.getElementById("cata08t").innerHTML =
            "A collection of video game projects. Does not include video games created together with other individuals.";
    }
    
    else if(fileName == "artmaking.html") {
        document.getElementById("text01").innerHTML = 
            "Welcome to the Cave - Artmaking Branch.";
        document.getElementById("text02").innerHTML = 
            "My art-related creations. These only include projects that are done purely out of my own desire, not because it was a requirement as a part of some education or study.";
        
        document.getElementById("proj01a").innerHTML =
            "Lava Lamp";
        document.getElementById("proj01s").innerHTML =
            "September 2017";
        document.getElementById("proj01t").innerHTML =
            "A clay-based lava lamp figurine serving as a desktop ornament. Primarily an attampt creating a highly resilient object with a rather fragile geometry.";
        
        document.getElementById("proj02a").innerHTML =
            "Grand Canyon";
        document.getElementById("proj02s").innerHTML =
            "December 2017";
        document.getElementById("proj02t").innerHTML =
            "Acrylic painting of the Grand Canyon with no visual aids but a memory of visiting 3 years prior to painting it. Low poly styles are randomly applied in several regions.";
        
        document.getElementById("proj03a").innerHTML =
            "World Generation Settings";
        document.getElementById("proj03s").innerHTML =
            "October 2018";
        document.getElementById("proj03t").innerHTML =
            "An interactive acrylic painting with four indiviudal stripes of images capable of sliding sideways to result in a combination of biomes, essentially representing a biosphere. Each slider represents a gradient between two opposing personality traits.";
        
        document.getElementById("proj04a").innerHTML =
            "Defense";
        document.getElementById("proj04s").innerHTML =
            "October 2018";
        document.getElementById("proj04t").innerHTML =
            "A neuron shattering a mirror upon viewing itself.";
        
        document.getElementById("proj05a").innerHTML =
            "Transuniversal Synapse";
        document.getElementById("proj05s").innerHTML =
            "October 2018";
        document.getElementById("proj05t").innerHTML =
            "A blue neuron inside a sphere full of stellar bodies forming a synaptic connection with a red neuron outside of that sphere.";
        
        document.getElementById("proj06a").innerHTML =
            "Auroras in Search";
        document.getElementById("proj06s").innerHTML =
            "March 2019";
        document.getElementById("proj06t").innerHTML =
            "The largest painting I've ever done until now, and more importantly a 24 hour SPEEDRUN. Countless frosted trees are forming a forest at night while multiple streaks of auroras stretch across the sky.";
        
        document.getElementById("proj07a").innerHTML =
            "Cloud Factory";
        document.getElementById("proj07s").innerHTML =
            "May 2019";
        document.getElementById("proj07t").innerHTML =
            "Painting based on a true sight where the formations of cumulus clouds and their growth into cumulonimbus clouds were visible.";
        
        document.getElementById("proj08a").innerHTML =
            "Richard Bigman";
        document.getElementById("proj08s").innerHTML =
            "January 2020";
        document.getElementById("proj08t").innerHTML =
            "A polymer clay figurine of a humanoid creature.";
    }
    
    else if(fileName == "astrophotography.html") {
        document.getElementById("text01").innerHTML = 
            "Welcome to the Cave - Astrophotography Branch.";
        document.getElementById("text02").innerHTML = 
            "Photos of stellar bodies taken by myself. My telescope sucks and I don't have a camera, so these photos are terrible.";
        
        document.getElementById("proj01a").innerHTML =
            "Milky Way 01";
        document.getElementById("proj01s").innerHTML =
            "June 2019";
        document.getElementById("proj01t").innerHTML =
            "A photograph of the Milky Way taken in Morro Bay, CA, USA. This was also the first time I have ever seen the Milky Way with the naked eye.";
        
        document.getElementById("proj02a").innerHTML =
            "Milky Way 02 + Andromeda";
        document.getElementById("proj02s").innerHTML =
            "July 2019";
        document.getElementById("proj02t").innerHTML =
            "A better photograph of the Milky Way, taken in Yellowstone National Park, WY, USA. The Andromeda galaxy is also visible in the second image.";
        
        document.getElementById("proj03a").innerHTML =
            "The Great Conjunction";
        document.getElementById("proj03s").innerHTML =
            "December 2020";
        document.getElementById("proj03t").innerHTML =
            "The famous Great Conjunction between Jupiter and Saturn which occurred on 6PM 12/21. The two were only 6.1 arcminutes apart. All four Galilean Satellites are visible in the second image.";
    }
    
    else if(fileName == "computing.html") {
        document.getElementById("text01").innerHTML = 
            "Welcome to the Cave - Computing Branch.";
        document.getElementById("text02").innerHTML = 
            "A group of purely computing projects. Video game-related projects have their own category.";
        
        document.getElementById("proj01a").innerHTML =
            "Mandelbrot Set Explorer II";
        document.getElementById("proj01s").innerHTML =
            "November 2019";
        document.getElementById("proj01t").innerHTML =
            "Otherwise used to create desktop background images, this one of many Mandelbrot Explorers in the world is capable of applying custom color schemes and the rate of color transition. This application is not perfect, and although quite rare, can crash.";
        
        document.getElementById("proj02a").innerHTML =
            "Visualized Huffman Compressor";
        document.getElementById("proj02s").innerHTML =
            "November 2019";
        document.getElementById("proj02t").innerHTML =
            "A file compressing software which utilizes the Huffman encoding/decoding algorithms. The Huffman Tree is displayed with animation when compressing an item.";
        
        document.getElementById("proj03a").innerHTML =
            "Dijkstra Map Pathfinder";
        document.getElementById("proj03s").innerHTML =
            "December 2019";
        document.getElementById("proj03t").innerHTML =
            "A shortest-path finding application which takes in a text file of any map in the form of a graph, then creating a visualization of the map. The shortest path is then displayed on this zoomable map. This project contains quite a bit of bugs, especially the zoom function.";
    }
    
    else if(fileName == "engineering.html") {
        document.getElementById("text01").innerHTML = 
            "Welcome to the Cave - Engineering Branch.";
        document.getElementById("text02").innerHTML = 
            "Various projects which required aspects of engineering.";
        
        document.getElementById("proj01a").innerHTML =
            "Shampoo Buster 4.0";
        document.getElementById("proj01s").innerHTML =
            "2015";
        document.getElementById("proj01t").innerHTML =
            "An assembly of various metal pipe pieces as a pressure-powered rifle. This makeshift weapon uses 1.5-inch nail blowdarts as ammunition, and is capable of fully penetrating 10mm of plywood.";
        
        document.getElementById("proj02a").innerHTML =
            "Mobile Clock v1.0";
        document.getElementById("proj02s").innerHTML =
            "December 2018";
        document.getElementById("proj02t").innerHTML =
            "An electric mobile with multiple rotating illuminators acting as the sun and the moon, lighting up a small piece of land. The does not reflect real time and various aspects were modified to become an artwork, as this was done as an art project at school.";
    }
    
    else if(fileName == "pets.html") {
        document.getElementById("text01").innerHTML = 
            "Welcome to the Cave - Pets Branch.";
        document.getElementById("text02").innerHTML = 
            "Projects related to pets and petkeeping.";
        
        document.getElementById("proj01a").innerHTML =
            "Breeding Fish";
        document.getElementById("proj01s").innerHTML =
            "December 2016";
        document.getElementById("proj01t").innerHTML =
            "12 diseased guppies were obtained, successfully cured, and bred to over 300 in number. Also my first time successfully breeding an animal.";
        
        document.getElementById("proj02a").innerHTML =
            "Sugar Gliders";
        document.getElementById("proj02s").innerHTML =
            "January 2017";
        document.getElementById("proj02t").innerHTML =
            "Successfully obtained and raised a pair of sugar gliders. Gave away to someone else after 2.5 years due to unexpected reasons. Unsure if this project will be revisited later on due to expensive cost.";
        
        document.getElementById("proj03a").innerHTML =
            "White's Tree Frog";
        document.getElementById("proj03s").innerHTML =
            "May 2017";
        document.getElementById("proj03t").innerHTML =
            "Successfully obtained and raised a White's tree frog. Keeping this frog lasted for only about 3 months due to unexpected reasons, and gave away to someone else. I will revisit this project later on.";
        
        document.getElementById("proj04a").innerHTML =
            "Crystal Red Shrimp";
        document.getElementById("proj04s").innerHTML =
            "November 2020";
        document.getElementById("proj04t").innerHTML =
            "Successfully obtained and raised multiple CRS. Breeding is also successful, and the tank looks amazing. There are also amano shrimp, blue velvet shrimp (also successfully breeding), and two dwarf shrimps of unknown species.";
    } 
    
    else if(fileName == "plants.html") {
        document.getElementById("text01").innerHTML = 
            "Welcome to the Cave - Plants Branch.";
        document.getElementById("text02").innerHTML = 
            "Projects related to plants, gardening, and no-fauna tank setups. There were countlessly many more projects in this category, therefore only the most notable ones are mentioned here.";
        
        document.getElementById("proj01a").innerHTML =
            "Morning Glory";
        document.getElementById("proj01s").innerHTML =
            "2009";
        document.getElementById("proj01t").innerHTML =
            "The first plant I have ever grown from a seed that I have collected on my own and successfully yielded a second generation of its seeds.";
        
        document.getElementById("proj02a").innerHTML =
            "Discovering New Phenotype";
        document.getElementById("proj02s").innerHTML =
            "2011";
        document.getElementById("proj02t").innerHTML =
            "Successfully discovered a new phenotype from continuously re-planting morning glory seeds. Originally, all flowers were primarily blue with a white core, but current specimens now has a noticeable magenta coloring in the transition line.";
        
        document.getElementById("proj03a").innerHTML =
            "Columbine";
        document.getElementById("proj03s").innerHTML =
            "2015";
        document.getElementById("proj03t").innerHTML =
            "Successfully planted a seed of a columbine and had it continuously blossoming each year in my yard.";
        
        document.getElementById("proj04a").innerHTML =
            "Staghorn Fern";
        document.getElementById("proj04s").innerHTML =
            "April 2020";
        document.getElementById("proj04t").innerHTML =
            "Successfully grew 3 different species of staghorn fern.";
        
        document.getElementById("proj05a").innerHTML =
            "Balloon Vine";
        document.getElementById("proj05s").innerHTML =
            "October 2020";
        document.getElementById("proj05t").innerHTML =
            "Successfully grew a balloon vine from a collected seed.";
    }
 
    else if(fileName == "random.html") {
        document.getElementById("text01").innerHTML = 
            "Welcome to the Cave - Random Branch.";
        document.getElementById("text02").innerHTML = 
            "Pointless yet entertaining random projects.";
        
        document.getElementById("proj01a").innerHTML =
            "Discover a Fossil";
        document.getElementById("proj01s").innerHTML =
            "Jaunuary 2019";
        document.getElementById("proj01t").innerHTML =
            "A large pile of petrified wood was discovered in the middle of a desert in Egypt. Four small pieces of these piles were brought back home. The largest of the four is significant in that it shows clear indication of active wood-eating organisms which lived in this wood. It is likely that this wood was petrified after it was already dead.";
        
        document.getElementById("proj02a").innerHTML =
            "Bismuth Crystals";
        document.getElementById("proj02s").innerHTML =
            "December 2019";
        document.getElementById("proj02t").innerHTML =
            "Learn the optimal way to create bismuth crystals with household materials. Insulating the molten metal, seeding the crystal, and careful timing are shown to be crucial in achieving this.";
        
        document.getElementById("proj03a").innerHTML =
            "Catch a Large Fish and Eat It";
        document.getElementById("proj03s").innerHTML =
            "June 2020";
        document.getElementById("proj03t").innerHTML =
            "Caught a nearly 40cm rockfish and cooked a fish stew out of it.";
    }
    
    else if(fileName == "video_games.html") {
        document.getElementById("text01").innerHTML = 
            "Welcome to the Cave - Video Games Branch.";
        document.getElementById("text02").innerHTML = 
            "A collection of video game projects. Does not include video games created together with other individuals.";
        
        document.getElementById("proj01a").innerHTML =
            "Minecraft - Castle Wars";
        document.getElementById("proj01s").innerHTML =
            "2013-2017";
        document.getElementById("proj01t").innerHTML =
            "Essentially my first ever programming experience. Castle Wars is a simple 4-team base-building and fighting game, where each team must strive to eliminate opponent team members while trying to not die. If one player dies a certain number of times, their team loses and the game is over.";
        
        document.getElementById("proj02a").innerHTML =
            "Minecraft - Maze Runner";
        document.getElementById("proj02s").innerHTML =
            "January 2015";
        document.getElementById("proj02t").innerHTML =
            "A Minecraft experience of the Maze Runner movie. This map ended up receiving around 20,000 downloads, which was a lot considering how buggy this map was. It was abandoned in the midst of finishing, but it is still somewhat playable.";
        
        document.getElementById("proj03a").innerHTML =
            "Console Fighters";
        document.getElementById("proj03s").innerHTML =
            "November 2016";
        document.getElementById("proj03t").innerHTML =
            "My very first video game created with an actual programming language. DO NOT READ CODE. This is a luck-based player vs entity combat game, where the player must kill an enemy to progress and fight another, stronger enemy. There are multiple kits with different abilities, and each progression allows the player to choose an upgrade themselves. Added a GUI later on because nobody likes to play a game on a terminal window.";
        
        document.getElementById("proj04a").innerHTML =
            "Sean Game";
        document.getElementById("proj04s").innerHTML =
            "February 2017";
        document.getElementById("proj04t").innerHTML =
            "An early attempt to learn GUI programming in Java in order to apply the knowledge gained in class to create applications which are more user-friendly than console. Here, the player must control \"Sean\" using buttons on screen to eat the food before time runs out. The timer shortens after every 10 successful iterations, and the game continues until the player fails to feed \"Sean\".";
        
        document.getElementById("proj05a").innerHTML =
            "3D 2048";
        document.getElementById("proj05s").innerHTML =
            "September 2019";
        document.getElementById("proj05t").innerHTML =
            "A simple 2048 game with 3D visuals. Essentially the first decently-polished Java program I have ever written.";
        
        document.getElementById("proj06a").innerHTML =
            "Exponentiation Bubbles";
        document.getElementById("proj06s").innerHTML =
            "December 2020";
        document.getElementById("proj06t").innerHTML =
            "A \"Write a Game In 24 Hours Challenge\" I have done while I was sick, using a language I barely know (Javascript). In this game, the player is required to pop bubbles with a gun while dodging them. Popping a bubble splits it into two smaller bubbles, and popping all of them will allow the player to progress to the next level with larger bubbles. Popping bubbles and level progression provides coins, which can be used for various upgrades.";
    }
    
    else if(fileName == "lichens.html") {
        document.getElementById("text01").innerHTML = 
            "Featured Lichens.";
        
        document.getElementById("lich01a").innerHTML =
            "Cladonia rangiferina";
        document.getElementById("lich01s").innerHTML =
            "Lichen of the Year 2017";
        document.getElementById("lich01t").innerHTML =
            "Found in tundras, Cladonia rangiferina is a fluffy lichen that is extremely vulnerable to air pollution, and unlike most other lichens, also vulnerable to low humidity. Also known as reindeer lichen or caribou lichen, it is a part of caribou's main diet during the warmer climates of tundra environment. However, it can survive in very cold climates with barely any sunlight.";
        
        document.getElementById("lich02a").innerHTML =
            "Cladonia stellaris";
        document.getElementById("lich02s").innerHTML =
            "Lichen of the Year 2018";
        document.getElementById("lich02t").innerHTML =
            "Also Found in tundras, Cladonia stellaris is an extremely fluffy lichen that is somewhat vulnerable to air pollution, and unlike most other lichens, also vulnerable to low humidity. Once it's gone dry, it's dead; rehumidifying it will bring back its fluffiness for a while, but doing so is equivalent to soaking water in a dead sponge. This lichen is also often dyed and used for natural-looking decorations. While some people claim that watering such decorations will aid in its growth, little do they know that those lichens are already long dead.";
        
        document.getElementById("lich03a").innerHTML =
            "Cladonia pyxidata";
        document.getElementById("lich03s").innerHTML =
            "Lichen of the Year 2019";
        document.getElementById("lich03t").innerHTML =
            "Found in colder temperate regions with high precipitation, Cladonia pyxidata is a stiff lichen that resembles what might be an alien flora. Somewhat vulnerable to air pollution and otherwise relatively hardy in its natural habitat, this lichen almost always grows alongside moss. Also known as pixie cups, its concave podetia seems to serve as a means of temporarily capturing water during rain, mix in its spores, and flowing it away.";
        
        document.getElementById("lich04a").innerHTML =
            "Xanthoria parietina";
        document.getElementById("lich04s").innerHTML =
            "Lichen of the Year 2020";
        document.getElementById("lich04t").innerHTML =
            "A yellow-orange foliose lichen with multiple concave bowl-like protrusions commonly found in temprate regions with mild levels of precipitation. This specie of lichen grows and spreads rather quickly in comparison to most others, often spanning an entire branch of a living, growing tree. Interestingly, this lichen is also very tolerant to airborne pollutants including heavy metal contaminations.";
    }
    
    document.getElementById("menu01").innerHTML = "Home";
    document.getElementById("menu02").innerHTML = "About";
    document.getElementById("menu03").innerHTML = "Garage";
    document.getElementById("menu04").innerHTML = "Cave";
    document.getElementById("menu05").innerHTML = "Lichens";
}

function writeKorean() {
        
    if(fileName == "index.html") {
       document.getElementById("text01").innerHTML =
            "안녕하세요.";
        document.getElementById("text02").innerHTML = 
            "웹프로그래밍도 배울겸 재미로 만들어본 사이트 입니다. 제 포트폴리오라든지 보러 오신거라면 잘못 찾아왔습니다.";
        document.getElementById("tranBtn").innerHTML =
            "Bring back English";
        
        document.getElementById("text03").innerHTML =
            "Featured Items:"
        
        document.getElementById("feat01a").innerHTML =
            "DynSky - 동적 이미지 시계";
        document.getElementById("feat01s").innerHTML =
            "개발중 (40%), 시작일: 2020년 10월";
        document.getElementById("feat01t").innerHTML =
            "단지 숫자나 시곗바늘뿐이 아닌 지속적으로 변하는 그림을 통해서 현재 시간을 보여주는 시계. 만화나 일본 애니메이션 스타일의 풍경화가 현지 시간, 날씨, 등에 맞추어 자동으로 생성된다. 용도에 맞춰 최적화된, 이론적으로 raycasting/tracing보다 더 효율적인 알고리즘을 통해 GPU 없이도 4GB RAM CPU만으로 150만 픽셀 화면을 띄울때 10 FPS 이상을 유지할 수 있다.";
        
        document.getElementById("feat02a").innerHTML =
            "기하급수적 버블";
        document.getElementById("feat02s").innerHTML =
            "2020년 12월";
        document.getElementById("feat02t").innerHTML =
            "\"24시간 내에 게임 만들기 첼린지\"을 거의 모르는 언어로 시험기간에 장염에 걸린 채로 한 결과이다. 아케이드 스타일의 이 게임은 버블을 총으로 터트리면서 피하고 모든 버블을 제거하면 다음 스테이지로 넘어가는 형식으로 진행된다. 레벨 1 이상의 버블을 터트리면 두개의 한 레벨 더 낮은 버블로 나뉘며 버블을 터트릴 때나 스테이지를 완료할때 코인을 얻는다. 이 코인들로 다양한 업그레이드를 할 수 있다.";
    }
            
    else if(fileName == "about.html") {
        document.getElementById("text01").innerHTML = 
            "나에 대한 간략한 설명:";
        document.getElementById("list0-0").innerHTML = 
            "이름: 민경한 / Kyounghan Min / Kevin Min / Kevin1031";
        document.getElementById("list0-1").innerHTML =
            "생년월일: 2000년 10월 31일";
        document.getElementById("revealBtn").innerHTML =
            "더보기";

        let revealLv = Number(sessionStorage.getItem("aboutRevealLv"));
        if(revealLv >= 1) {
            document.getElementById("list1-0").innerHTML = 
                "학력: 컴퓨터미디어공학 학사과정 이수중";
            document.getElementById("list1-1").innerHTML =
                "고용상태: 백수";
            document.getElementById("list1-2").innerHTML =
                "고등학교: CCS -> 대전외국인학교";
            document.getElementById("list1-3").innerHTML =
                "대학교: 로체스터 대학교 -> 조지아 공과대학교";
        }
        if(revealLv >= 2) {
            document.getElementById("list2-0").innerHTML = 
                "가장 좋아하는 색: 청록 / 시안 / #00FFFF / RGB(0,255,255) / HSL(180,100,50) / CMYK(100,0,0,0)";
            document.getElementById("list2-1").innerHTML =
                "가장 좋아하는 계절: 여름이 아닌 계절";
            document.getElementById("list2-2").innerHTML = 
                "가장 좋아하는 동물: 플레미쉬 자이언트 토끼 (Oryctolagus cuniculus domesticus)";
            document.getElementById("list2-3").innerHTML =
                "가장 좋아하는 식물: 하늘매발톱 (Aquilegia flabellata)";
            document.getElementById("list2-4").innerHTML =
                "가장 좋아하는 음식: 잘 차려진 밥상";
        }
        if(revealLv >= 3) {
            document.getElementById("list3-0").innerHTML = 
                "가장 살고싶은 나라 3개 (순서대로): 한국, 일본, 미국";
            document.getElementById("list3-1").innerHTML =
                "가장 좋아하는 영화 3개 (순서대로): 인터스텔라, 메이즈 러너, 스타워즈 (≤6)";
            document.getElementById("list3-2").innerHTML =
                "가장 좋아하는 취미 3개 (순서대로): 코딩, 뭐든지 만들거나 그리기, 게임";
            document.getElementById("list3-3").innerHTML = 
                "갖고싶은 초능력: 전지전능";
            document.getElementById("list3-4").innerHTML =
                "갖고싶은 초능력 (신적 능력 제외): 초광속 이동";
            document.getElementById("list3-5").innerHTML =
                "갖고싶은 초능력 (신적 능력 제외, 물리법칙 적용): 인공지능 마인드 컨트롤";
            document.getElementById("list3-6").innerHTML =
                "지금까지의 최고의 게임: 마인크래프트";
            document.getElementById("list3-7").innerHTML =
                "가장 좋아하는 학자: 앨런 튜링";
        }
        if(revealLv >= 4) {
            document.getElementById("list4-0").innerHTML = 
                "가장 좋아하는 이온화합물: 황산철 칠수화물";
            document.getElementById("list4-1").innerHTML =
                "가장 좋아하는 지의류: Cladonia pyxidata";
            document.getElementById("list4-2").innerHTML =
                "가장 좋아하는 자료구조: 해시 테이블";
            document.getElementById("list4-3").innerHTML =
                "가장 좋아하는 구름: 봉우리 적운";
            document.getElementById("list4-4").innerHTML =
                "두번째로 가장 좋아하는 숫자: 16";
            document.getElementById("list4-5").innerHTML =
                "사랑니 갯수: 0개";
            document.getElementById("list4-6").innerHTML =
                "가장 좋아하는 아원자 입자: 양전자";
            document.getElementById("list4-7").innerHTML = 
                "MBTI 결과: 88점";
        }
        if(revealLv >= 6) {
            document.getElementById("list6-0").innerHTML = 
                "가장 좋아하는 연예인: 없음";
            document.getElementById("list6-1").innerHTML = 
                "가장 좋아하는 TV프로: 없음";
            document.getElementById("list6-2").innerHTML = 
                "가장 좋아하는 소설: 없음";
            document.getElementById("list6-3").innerHTML = 
                "가장 좋아하는 노래: 없음";
            document.getElementById("list6-4").innerHTML = 
                "가장 좋아하는 웹툰: 없음";
            document.getElementById("list6-5").innerHTML = 
                "개 or 고양이: 토끼";
            document.getElementById("list6-6").innerHTML = 
                "되고싶은 사람 (롤모델): 없음";
        }
    }
    
    else if(fileName == "garage.html") {
        document.getElementById("text01").innerHTML = 
            "이곳은 차고지.";
        document.getElementById("text02").innerHTML = 
            "현재 개발중이거나 미래에 할 프로젝트들을 모아놓은 공간. 이 중에서 10%라도 할 수 있을지...";
        
        document.getElementById("proj01a").innerHTML =
            "B-Tring (Pre-Alpha) - 원형 리듬게임";
        document.getElementById("proj01s").innerHTML =
            "일시중지됨 (80%), 시작일: 2018년 8월";
        document.getElementById("proj01t").innerHTML =
            "기존의 기타/막대형 리듬게임들과는 달리 비트가 내려오는 레일들이 한 중심을 두고 동그랗게 퍼져있다. 각 레일들이 자유롭게 움직이게 됨으로써 각 레벨들을 더욱 창의적으록 구현할 수 있다. 사실 어려서부터 이런 형식의 리듬게임을 하고 싶었으나 존재하지 않아 직접 만들게 된 것.";
        
        document.getElementById("proj02a").innerHTML =
            "DynSky - 동적 이미지 시계";
        document.getElementById("proj02s").innerHTML =
            "개발중 (40%), 시작일: 2020년 10월";
        document.getElementById("proj02t").innerHTML =
            "단지 숫자나 시곗바늘뿐이 아닌 지속적으로 변하는 그림을 통해서 현재 시간을 보여주는 시계. 만화나 일본 애니메이션 스타일의 풍경화가 현지 시간, 날씨, 등에 맞추어 자동으로 생성된다. 용도에 맞춰 최적화된, 이론적으로 raycasting/tracing보다 더 효율적인 알고리즘을 통해 GPU 없이도 4GB RAM CPU만으로 150만 픽셀 화면을 띄울때 10 FPS 이상을 유지할 수 있다.";
        
        document.getElementById("proj03a").innerHTML =
            "청록색 나팔꽃";
        document.getElementById("proj03s").innerHTML =
            "개발중 (??%), 시작일: 2009년도";
        document.getElementById("proj03t").innerHTML =
            "아직 존재하지 않는 청록색 나팔꽃을 선택적 번식만을 통해서 만들어내려는 시도. 파란 나팔꽃들 중 꽃잎에 엽록소 농도가 더 높은 종만을 선택하고 있다.";
        
        document.getElementById("proj04a").innerHTML =
            "실내 부들";
        document.getElementById("proj04s").innerHTML =
            "미래 프로젝트";
        document.getElementById("proj04t").innerHTML =
            "실내에서 부들을 키워내기. 성공적으로 자라난다면 작은 실내 연못 또한 가능해진다.";
        
        document.getElementById("proj05a").innerHTML =
            "AFK 결정체 프로젝트";
        document.getElementById("proj05s").innerHTML =
            "개발중 (20%), 시작일: 2020년 12월";
        document.getElementById("proj05t").innerHTML =
            "철 이온 화합물들로 결정체를 만들어내려는 쓸데없는 프로젝트. 목표는 지름 10cm이다.";
        
        document.getElementById("proj06a").innerHTML =
            "TLAAD: Terminal Low Altitude Area Defense";
        document.getElementById("proj06s").innerHTML =
            "미래 프로젝트";
        document.getElementById("proj06t").innerHTML =
            "사람이나 움직이는 물체를 겨냥, 고정, 그리고 사격이 가능한 총기 포탑을 만들어내려는 프로젝트. 포탑을 향해 날아오는 물체를 발견할 경우 요격을 하는 기능도 갖춘다.";
        
        document.getElementById("proj07a").innerHTML =
            "리톱스";
        document.getElementById("proj07s").innerHTML =
            "개발중 (5%), 시작일: 2020년 9월";
        document.getElementById("proj07t").innerHTML =
            "최고난이도 다육식물 중 하나로 알려진 리톱스를 씨앗에서부터 키워내려는 프로젝트.";
        
        document.getElementById("proj08a").innerHTML =
            "안개 숲 테라리움";
        document.getElementById("proj08s").innerHTML =
            "미래 프로젝트";
        document.getElementById("proj08t").innerHTML =
            "400리터 이상 어항을 습한 남일본 생태계와 비슷하게 미니어쳐 숲을 만들어내기. 다양한 이끼, 직접 (대충) 키워낸 분재, 흐르는 온천수, 그리고 LED 조명이 들어오는 전통 가옥들을 포함한다. 동물은 넣지 않을 것";
        
        document.getElementById("proj09a").innerHTML =
            "Popcoral Jukebox";
        document.getElementById("proj09s").innerHTML =
            "미래 프로젝트";
        document.getElementById("proj09t").innerHTML =
            "게임에 나오는 식물 피규어가 달린 자동 음악 재생기.";
        
        document.getElementById("proj10a").innerHTML =
            "Orange Justice in a Box";
        document.getElementById("proj10s").innerHTML =
            "미래 프로젝트";
        document.getElementById("proj10t").innerHTML =
            "음악이나 비트가 감지되면 장착된 인형이 이상한 춤을 추는 상자.";
        
        document.getElementById("proj11a").innerHTML =
            "Chaos Jukebox";
        document.getElementById("proj11s").innerHTML =
            "미래 프로젝트";
        document.getElementById("proj11t").innerHTML =
            "정신없고 혼란스러운 소리들을 자동으로 생성 및 조합해 트는 상자.";
        
        document.getElementById("proj12a").innerHTML =
            "책상위 모빌 시계";
        document.getElementById("proj12s").innerHTML =
            "미래 프로젝트";
        document.getElementById("proj12t").innerHTML =
            "러스틱한 분위기의 소형 모빌 시계. 이전에 만들었던 \"모빌 시계 v1.0 (Mobile Clock v1.0)\"과 비슷하나 실제 시간대로 움직이며 일체형으로 더 견고하게 만들 것.";
        
        document.getElementById("proj13a").innerHTML =
            "볼 파이톤";
        document.getElementById("proj13s").innerHTML =
            "미래 프로젝트";
        document.getElementById("proj13t").innerHTML =
            "성공적으로 볼 파이톤 키우기.";
        
        document.getElementById("proj14a").innerHTML =
            "플레미쉬 자이언트 토끼";
        document.getElementById("proj14s").innerHTML =
            "미래 프로젝트";
        document.getElementById("proj14t").innerHTML =
            "성공적으로 플레미쉬 자이언트 토끼 키우기.";
        
        document.getElementById("proj15a").innerHTML =
            "대진화 시뮬레이션";
        document.getElementById("proj15s").innerHTML =
            "미래 프로젝트";
        document.getElementById("proj15t").innerHTML =
            "생식, 변이, 그리고 자연선택으로 이루어진 최적화된 2D 가상 대진화 시뮬레이션. 기존의 시뮬레이션들과는 달리 유전자의 표현형들(속도, 크기, 등)을 미리 정의하지 않고 유전정보만을 기반으로 단백질을 형성하여 생명체를 이루는 방식으로 소진화 뿐만 아니라 대진화를 가능하게 한다. 원하는 바 대로 성공할 경우 UI 등을 개선시켜 가상 테라리움으로 만들 수 있다.";
        
        document.getElementById("proj16a").innerHTML =
            "사마귀";
        document.getElementById("proj16s").innerHTML =
            "미래 프로젝트";
        document.getElementById("proj16t").innerHTML =
            "성공적으로 사마귀 알 채집, 부화, 짝짓기, 그리고 산란까지 시키기.";
    }

    else if(fileName == "cave.html") {
        document.getElementById("text01").innerHTML = 
            "이곳은 동굴.";
        document.getElementById("text02").innerHTML = 
            "과거 프로젝트들을 모아놓은 공간.";
        
        document.getElementById("cata01a").innerHTML =
            "예술";
        document.getElementById("cata01s").innerHTML =
            "8개";
        document.getElementById("cata01t").innerHTML =
            "예술, 그 중 과반수가 미술에 관련된 프로젝트들.";
        
        document.getElementById("cata02a").innerHTML =
            "천체 사진";
        document.getElementById("cata02s").innerHTML =
            "3개";
        document.getElementById("cata02t").innerHTML =
            "직접 찍은 천체 사진들. 카메라가 따로 없기 때문에 화질이 구리다.";
        
        document.getElementById("cata03a").innerHTML =
            "컴퓨터";
        document.getElementById("cata03s").innerHTML =
            "3개";
        document.getElementById("cata03t").innerHTML =
            "순전히 컴퓨터(소프트웨어)에 관련된 프로젝트들.";
        
        document.getElementById("cata04a").innerHTML =
            "공학";
        document.getElementById("cata04s").innerHTML =
            "2개";
        document.getElementById("cata04t").innerHTML =
            "공학적 요소들를 갖춘 프로젝트들.";
        
        document.getElementById("cata05a").innerHTML =
            "동물";
        document.getElementById("cata05s").innerHTML =
            "4개";
        document.getElementById("cata05t").innerHTML =
            "동물, 혹은 동물 키우기에 관련.";
        
        document.getElementById("cata06a").innerHTML =
            "식물";
        document.getElementById("cata06s").innerHTML =
            "5개";
        document.getElementById("cata06t").innerHTML =
            "식물, 혹은 식물 키우기에 관련. 사실 이보다 훨씬 많으나 중요한 것들만 모아놓음.";
        
        document.getElementById("cata07a").innerHTML =
            "랜덤";
        document.getElementById("cata07s").innerHTML =
            "3개";
        document.getElementById("cata07t").innerHTML =
            "쓸데없지만 재미로 했던 프로젝트들.";
        
        document.getElementById("cata08a").innerHTML =
            "게임";
        document.getElementById("cata08s").innerHTML =
            "6개";
        document.getElementById("cata08t").innerHTML =
            "직접 만든 게임, 혹은 게임 속의 게임.";
    }
    
    else if(fileName == "artmaking.html") {
        document.getElementById("text01").innerHTML = 
            "동굴 - 예술.";
        document.getElementById("text02").innerHTML = 
            "예술, 그 중 과반수가 미술에 관련된 프로젝트들.";
        
        document.getElementById("proj01a").innerHTML =
            "라바램프 (Lava Lamp)";
        document.getElementById("proj01s").innerHTML =
            "2017년 9월";
        document.getElementById("proj01t").innerHTML =
            "점토 따위로 만든 쓸데없이 견고한 라바램프 모형. 책상 위에 두기에 적합하다.";
        
        document.getElementById("proj02a").innerHTML =
            "그랜드 캐니언 (Grand Canyon)";
        document.getElementById("proj02s").innerHTML =
            "2017년 10월";
        document.getElementById("proj02t").innerHTML =
            "3년전 기억을 토대로 칠해낸 그랜드 캐니언의 모습. Low poly식 스타일을 부분적으로 삽입했다.";
        
        document.getElementById("proj03a").innerHTML =
            "월드 생성 설정 (World Generation Settings)";
        document.getElementById("proj03s").innerHTML =
            "2018년 10월";
        document.getElementById("proj03t").innerHTML =
            "옆으로 당기면 새로운 풍경 그림이 나오는 상자. 각 슬라이드를 얼마나 당기느냐에 따라 전체적인 환경 그림이 바뀐다. 슬라이드마다 양 끝에 서로 상반되는 성격 요소들이 적혀있다.";
        
        document.getElementById("proj04a").innerHTML =
            "방어 (Defense)";
        document.getElementById("proj04s").innerHTML =
            "2018년 10월";
        document.getElementById("proj04t").innerHTML =
            "자신의 보습이 비춰진 거울을 본 뉴런이 거울을 깨트린다.";
        
        document.getElementById("proj05a").innerHTML =
            "초우주적 시냅스 (Transuniversal Synapse)";
        document.getElementById("proj05s").innerHTML =
            "2018년 10월";
        document.getElementById("proj05t").innerHTML =
            "은하로 가득찬 공간 안의 파란 뉴런이 공간 밖의 붉은 뉴런과 시냅스를 이루고 있다.";
        
        document.getElementById("proj06a").innerHTML =
            "찾는 오로라들 (Auroras in Search)";
        document.getElementById("proj06s").innerHTML =
            "2019년 3월";
        document.getElementById("proj06t").innerHTML =
            "24시간만에 칠해낸 여태껏 가장 큰 그림. 눈에 덮힌 수많은 나무들 위로 여러 오로라들이 펼쳐져있다.";
        
        document.getElementById("proj07a").innerHTML =
            "구름 공장 (Cloud Factory)";
        document.getElementById("proj07s").innerHTML =
            "2019년 5월";
        document.getElementById("proj07t").innerHTML =
            "실제 본 풍경을 그대로 그린 그림. 적운이 생성되고 적란운으로 자라가는 과정이 보인다.";
        
        document.getElementById("proj08a").innerHTML =
            "리처드 빅맨 (Richard Bigman)";
        document.getElementById("proj08s").innerHTML =
            "2020년 1월";
        document.getElementById("proj08t").innerHTML =
            "폴리머 찰흙으로 만든 흰 피큐어.";
    }
    
    else if(fileName == "astrophotography.html") {
        document.getElementById("text01").innerHTML = 
            "동굴 - 천체 사진.";
        document.getElementById("text02").innerHTML = 
            "직접 찍은 천체 사진들. 카메라가 따로 없기 때문에 화질이 구리다.";
        
        document.getElementById("proj01a").innerHTML =
            "은하수 01";
        document.getElementById("proj01s").innerHTML =
            "2019년 6월";
        document.getElementById("proj01t").innerHTML =
            "처음으로 은하수를 직접 본 날 찍은 사진. 미국 캘리포니아 주의 모로 베이에서 찍었다.";
        
        document.getElementById("proj02a").innerHTML =
            "은하수 02 + 안드로메다";
        document.getElementById("proj02s").innerHTML =
            "2019년 7월";
        document.getElementById("proj02t").innerHTML =
            "좀 더 잘 찍힌 은하수 사진. 두번째 사진에서는 안드로메다가 희미하게 보이기도 한다. 미국 와이오밍 주의 옐로스톤 국립공원에서 찍은 사진.";
        
        document.getElementById("proj03a").innerHTML =
            "목성-토성 대근접";
        document.getElementById("proj03s").innerHTML =
            "2020년 12월";
        document.getElementById("proj03t").innerHTML =
            "목성과 토성이 12/21 6PM에 6.1각분밖에 안되는 거리로 대근접을 이루었던 모습의 사진. 두번째 사진에서는 갈릴레오 위성 4개가 모두 보인다.";
    }
    
    else if(fileName == "computing.html") {
        document.getElementById("text01").innerHTML = 
            "동굴 - 컴퓨터.";
        document.getElementById("text02").innerHTML = 
            "순전히 컴퓨터(소프트웨어)에 관련된 프로젝트들.";
        
        document.getElementById("proj01a").innerHTML =
            "망델브로 집합 탐색기 2";
        document.getElementById("proj01s").innerHTML =
            "2019년 11월";
        document.getElementById("proj01t").innerHTML =
            "색조와 그라데이션을 원하는 대로 조절할 수 있는 망델브로 집합 탐색기. 배경화면 만들기에 적합하다. 버그가 조금 있어 아주 가끔씩 정지되기도 하나 귀찮아서 고치지 않는다.";
        
        document.getElementById("proj02a").innerHTML =
            "허프만 파일 압축기";
        document.getElementById("proj02s").innerHTML =
            "2019년 11월";
        document.getElementById("proj02t").innerHTML =
            "무손실 파일 압축/압축 해제 스프트웨어. 압축할 경우 허프만 트리가 생성되는 과정을 GUI를 통해 보여준다.";
        
        document.getElementById("proj03a").innerHTML =
            "다익스트라 경로탐색기";
        document.getElementById("proj03s").innerHTML =
            "2019년 12월";
        document.getElementById("proj03t").innerHTML =
            "지도에 관한 정보를 그래프 형식으로 구현한 텍스트 파일을 읽어 지도를 그려낸 후 두 지점잔의 최단거리를 계산해 그려내는 프로그램. 지도를 확대할 수도 있으나 이 부분에 있어서는 귀찮아서 고치지 않은 버그가 있다.";
    }
    
    else if(fileName == "engineering.html") {
        document.getElementById("text01").innerHTML = 
            "동굴 - 공학.";
        document.getElementById("text02").innerHTML = 
            "Crafting projects which required little to no computing challenges but included aspects of engineering, or challenging computing projects which required engineering.";
        
        document.getElementById("proj01a").innerHTML =
            "샴푸 버스터 4.0";
        document.getElementById("proj01s").innerHTML =
            "2015년도";
        document.getElementById("proj01t").innerHTML =
            "금속 파이프로 만든 공기총. 1.5인치 못 블로우다트를 발사할 경우 10mm 합판을 뚫고 나간다.";
        
        document.getElementById("proj02a").innerHTML =
            "모빌 시계 v1.0";
        document.getElementById("proj02s").innerHTML =
            "2018년 12월";
        document.getElementById("proj02t").innerHTML =
            "전기모터로 가동되는 모빌로써 해, 달, 그리고 인공위성을 땅 모형 중심으로 회전시키며 낮/밤을 이룬다. 실제 시간대로 움직이지 않으며 학교 미술 프로젝트로 만들었기 때문에 억지로 예술적 요소를 집어넣었다.";
    }
    
    else if(fileName == "pets.html") {
        document.getElementById("text01").innerHTML = 
            "동굴 - 동물.";
        document.getElementById("text02").innerHTML = 
            "동물, 혹은 동물 키우기에 관련.";
        
        document.getElementById("proj01a").innerHTML =
            "물고기 번식";
        document.getElementById("proj01s").innerHTML =
            "2016년 12월";
        document.getElementById("proj01t").innerHTML =
            "이마트에서 산 백점병 걸린 구피 12마리를 치료 후 300마리 이상으로 번식시켰다. 처음으로 동물을 번식시킨 경험이기도 하다.";
        
        document.getElementById("proj02a").innerHTML =
            "슈가글라이더";
        document.getElementById("proj02s").innerHTML =
            "2017년 1월";
        document.getElementById("proj02t").innerHTML =
            "성공적으로 슈가글라이더 한 쌍을 키웠다. 2.5년간 키웠으며 예상치 못한 이유로 분양보내게 되었다. 비싼 가격 때문에 다시 키울지는 의문이다.";
        
        document.getElementById("proj03a").innerHTML =
            "화이트 트리 프록";
        document.getElementById("proj03s").innerHTML =
            "2017년 5월";
        document.getElementById("proj03t").innerHTML =
            "성공적으로 화이트 트리 프록을 키웠다. 예상치 못한 이유로 3개월만 키우고 분양보내게 되었다. 다시 키울 계획이다.";
        
        document.getElementById("proj04a").innerHTML =
            "CRS";
        document.getElementById("proj04s").innerHTML =
            "2020년 11월";
        document.getElementById("proj04t").innerHTML =
            "키우기 어렵기로 유명한 CRS를 성공적으로 키웠다. 블루벨벳, 야마토, 그리고 어떤 종인지 모르는 난쟁이새우 2마리도 성공적으로 키우고 있으며 마지막 2종을 제외하곤 번식 또한 성공적이다.";
    }
    
    else if(fileName == "plants.html") {
        document.getElementById("text01").innerHTML = 
            "동굴 - 식물.";
        document.getElementById("text02").innerHTML = 
            "식물, 혹은 식물 키우기에 관련. 사실 이보다 훨씬 많으나 중요한 것들만 모아놓음.";
        
        document.getElementById("proj01a").innerHTML =
            "나팔꽃";
        document.getElementById("proj01s").innerHTML =
            "2009년도";
        document.getElementById("proj01t").innerHTML =
            "처음으로 식물의 씨앗을 채집해 성공적으로 발아시킨 후 다음 세대의 씨앗까지 얻었다. 이 세대를 계속 이어 심는 중이다.";
        
        document.getElementById("proj02a").innerHTML =
            "새 표현형 찾아내기";
        document.getElementById("proj02s").innerHTML =
            "2011년도";
        document.getElementById("proj02t").innerHTML =
            "한 종류의 나팔꽃을 지속적으로 기르고 심던 중 꽃의 파란 부분과 하얀 부분 사이에 자줏빛 무늬를 지닌 표현형이 발견되었다.";
        
        document.getElementById("proj03a").innerHTML =
            "매발톱꽃";
        document.getElementById("proj03s").innerHTML =
            "2015년도";
        document.getElementById("proj03t").innerHTML =
            "매발톱 꽃 채집 후 성공적으로 집 마당에 정착시켜 매년 꽃을 피운다.";
        
        document.getElementById("proj04a").innerHTML =
            "박쥐란";
        document.getElementById("proj04s").innerHTML =
            "2020년 4월";
        document.getElementById("proj04t").innerHTML =
            "처음으로 키워보는 포자로 번식하는 식물인 박쥐란 3종을 성공적으로 키웠다.";
        
        document.getElementById("proj05a").innerHTML =
            "풍선덩굴";
        document.getElementById("proj05s").innerHTML =
            "2020년 10월";
        document.getElementById("proj05t").innerHTML =
            "풍선덩굴 씨앗을 거리에서 채집해 발아시킨 후 성공적으로 열매를 맺혔다.";
    }
 
    else if(fileName == "random.html") {
        document.getElementById("text01").innerHTML = 
            "동굴 - 랜덤.";
        document.getElementById("text02").innerHTML = 
            "쓸데없지만 재미로 했던 프로젝트들.";
        
        document.getElementById("proj01a").innerHTML =
            "화석 찾기";
        document.getElementById("proj01s").innerHTML =
            "2019년 1월";
        document.getElementById("proj01t").innerHTML =
            "이집트 사막 한가운데에서 화석화된 나무 여러 조각을 발견하고 이 중 작은 조각 4개를 채집했다. 벌레가 많이 파먹은 흔적이 뚜렷하며 이를 보아 이미 죽었던 나무가 화석으로 변했음을 유추해볼 수 있다.";
        
        document.getElementById("proj02a").innerHTML =
            "비스무트 결정";
        document.getElementById("proj02s").innerHTML =
            "2019년 12월";
        document.getElementById("proj02t").innerHTML =
            "비스무트 결정을 만드는 방법을 터득하는 프로젝트. 단열, 결정 파종, 그리고 꺼내는 타이밍을 알아냈다.";
        
        document.getElementById("proj03a").innerHTML =
            "월척을 낚고 매운탕 끓여먹기";
        document.getElementById("proj03s").innerHTML =
            "2020년 6월";
        document.getElementById("proj03t").innerHTML =
            "4자에 가까운 우럭을 낚아 매운탕을 해 먹었다.";
    }
    
    else if(fileName == "video_games.html") {
        document.getElementById("text01").innerHTML = 
            "동굴 - 게임.";
        document.getElementById("text02").innerHTML = 
            "직접 만든 게임, 혹은 게임 속의 게임.";
        
        document.getElementById("proj01a").innerHTML =
            "마인크래프트 - Castle Wars";
        document.getElementById("proj01s").innerHTML =
            "2013-2017년도";
        document.getElementById("proj01t").innerHTML =
            "어찌보면 최초의 코딩 경험이기도 한 마인크래프트 내 미니게임. 4개의 팀들이 경쟁하는 전투 게임으로써 자신의 기지를 만들고 적을 죽이면서 자신은 죽지 않아야 한다. 어느 한 플레이어가 정해진 횟수만큼 죽게 되면 그 팀이 패배하고 게임이 끝난다.";
        
        document.getElementById("proj02a").innerHTML =
            "마인크래프트 - 메이즈 러너";
        document.getElementById("proj02s").innerHTML =
            "2015년 1월";
        document.getElementById("proj02t").innerHTML =
            "당시 \"메이즈 러너\"라는 영화가 개봉하자 이 스토리와 배경을 따라 마인크래프트로 재구현한 맵. 다 끝내지도 않았으며 버그가 많았음에도 불구하고 홍보 없이 2만명이 다운로드를 하는 별거 아닌 기적을 경험했다.";
        
        document.getElementById("proj03a").innerHTML =
            "콘솔 파이터";
        document.getElementById("proj03s").innerHTML =
            "2016년 11월";
        document.getElementById("proj03t").innerHTML =
            "처음으로 실제 코딩 언어를 통해 만든 게임. 운 요소가 상당히 큰 싱글플레이어 1대1 게임이며 적을 물리치면 업그레이드를 하게되고 다음 적과 싸우는 단순한 게임이다. 다양한 업그레이드 선택지와 각자 다른 스킬을 가진 캐릭터들 중 하나를 고를 수 있다. GUI는 나중에 만들었다.";
        
        document.getElementById("proj04a").innerHTML =
            "션 게임";
        document.getElementById("proj04s").innerHTML =
            "2017년 2월";
        document.getElementById("proj04t").innerHTML =
            "GUI 프로그래밍을 빨리 배우려고 만들어본 게임. 마우스로 버튼을 클릭해서 \"션\"을 움직여야 하며 제한시간 내에 밥을 먹어야 다음으로 넘어갈 수 있다. 10회 연속 성공할때마다 제한시간이 줄며 먹는데 실패할때까지 계속된다.";
        
        document.getElementById("proj05a").innerHTML =
            "3D 2048";
        document.getElementById("proj05s").innerHTML =
            "2019년 9월";
        document.getElementById("proj05t").innerHTML =
            "단순한 2048게임의 3D 버전. 여태껏 처음으로 깔끔하게 완성시킨 프로그램이다.";
        
        document.getElementById("proj06a").innerHTML =
            "기하급수적 버블";
        document.getElementById("proj06s").innerHTML =
            "2020년 12월";
        document.getElementById("proj06t").innerHTML =
            "\"24시간 내에 게임 만들기 첼린지\"을 거의 모르는 언어로 시험기간에 장염에 걸린 채로 한 결과이다. 아케이드 스타일의 이 게임은 버블을 총으로 터트리면서 피하고 모든 버블을 제거하면 다음 스테이지로 넘어가는 형식으로 진행된다. 레벨 1 이상의 버블을 터트리면 두개의 한 레벨 더 낮은 버블로 나뉘며 버블을 터트릴 때나 스테이지를 완료할때 코인을 얻는다. 이 코인들로 다양한 업그레이드를 할 수 있다.";
    }
    
    else if(fileName == "lichens.html") {
        document.getElementById("text01").innerHTML = 
            "지의류 박물관.";
        
        document.getElementById("lich01a").innerHTML =
            "순록이끼 (Cladonia rangiferina)";
        document.getElementById("lich01s").innerHTML =
            "2017년도 \"올해의 지의류\" 선정";
        document.getElementById("lich01t").innerHTML =
            "극지방 부근 툰드라에 주로 서식하는 Cladonia rangiferina는 보들보들한 촉감을 가졌으며 대기 오염과 건조에 민감한 이 지의류는 사슴의 여름철 주 먹이가 되기도 하기에 \"순록이끼\"라는 이름이 붙기도 한다. 한번 수분이 날아가면 바로 죽어버릴 정도이며 물을 뿌려줄 경우 스폰지처럼 물을 빨아들여 보들보들한 촉감을 잠시 되살릴 수는 있으나 결코 다시 살아나지는 못한다. 그러나 극지방의 혹독한 겨울 속에서 수개월간 눈속에 파묻힌 채로도 거뜬히 살아간다.";
        
        document.getElementById("lich02a").innerHTML =
            "별꽃이끼 (Cladonia stellaris)";
        document.getElementById("lich02s").innerHTML =
            "2018년도 \"올해의 지의류\" 선정";
        document.getElementById("lich02t").innerHTML =
            "이 지의류 역시 극지방 부근 툰드라에 주로 서식하는 Cladonia stellaris는 믿기지 않을 정도로 보들보들한 촉감을 가졌다. 대기오염에 매우 민감하고 대부분의 지의류와는 달리 건조에도 민감하다. 이 종류의 지의류를 채집하여 색을 입힌 후 약물처리를 해 자연적인 느낌을 주는 인테리어 재료로 쓰이기도 한다. 어떤 사람들은 이 가공된 지의류에게 분무기로 물을 뿌리며 \"이래야 이끼가 잘 자란다\"고 하지만 결코 이끼도 아닌 죽은 지의류에 물 뿌리는 어이없는 행위에 불과할 뿐이다.";
        
        document.getElementById("lich03a").innerHTML =
            "컵이끼 (Cladonia pyxidata)";
        document.getElementById("lich03s").innerHTML =
            "2019년도 \"올해의 지의류\" 선정";
        document.getElementById("lich03t").innerHTML =
            "살짝 추운 온화한 기후에 서식하는 Cladonia pyxidata는 단단하고 먼지(포자)가 많이 날리는 지의류이며 외계 행성에서 발견될 만한 식물의 모습을 지녔다. 대기오염에 어느 정도 민감하지만 이 외에는 다양한 환경에서 잘 적응하고 번식한다. 거의 언제나 이끼와 같이 자랄 정도로 습기를 좋아하는 이 지의류는 컵 모양의 자기병에 빗물이 맞을 경우 포자를 물속에 섞어 흘려내리는 번식 전략을 가진 듯하다.";
        
        document.getElementById("lich04a").innerHTML =
            "황색이끼 (Xanthoria parietina)";
        document.getElementById("lich04s").innerHTML =
            "2020년도 \"올해의 지의류\" 선정";
        document.getElementById("lich04t").innerHTML =
            "밝은 황색을 띈 이 엽상지의류는 그릇 모양의 생식 조직들이 돋보인다. 적당한 강수량의 온화한 기후에 주로 서식하며 대기오염, 심지어 중금속 오염에도 끄떡없다. 성장속도 또한 다른 지의류에 비해 매우 빠르기 때문에 살아 성장하는 나뭇가지의 일부를 전부 덮어버리는 모습도 어렵지 않게 찾아볼 수 있다."; 
    }
    
    document.getElementById("menu01").innerHTML = "정문";
    document.getElementById("menu02").innerHTML = "정보";
    document.getElementById("menu03").innerHTML = "차고";
    document.getElementById("menu04").innerHTML = "동굴";
    document.getElementById("menu05").innerHTML = "지의류";
}

function updateDragonfly() {
    
    setTimeout(function() {
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        requestAnimationFrame(updateDragonfly);
        
        for(let i = 0; i < dragonflies.length; i++) {
            if(dragonflies[i].isGone) {
                if(i+1 < dragonflies.length) {
                    let temp = dragonflies[i];
                    dragonflies[i] = dragonflies[dragonflies.length-1];
                    dragonflies[dragonflies.length-1] = temp;
                }
                dragonflies.pop();
                i--;
                continue;
            }
            dragonflies[i].update();
        }
        
        for(let i = 0; i < flies.length; i++) {
            if(flies[i].isDead) {
                if(i+1 < flies.length) {
                    let temp = flies[i];
                    flies[i] = flies[flies.length-1];
                    flies[flies.length-1] = temp;
                }
                flies.pop();
                i--;
                continue;
            }
            flies[i].update();
        }
        
    }, 10);
}

function Dragonfly(x, y, xv, yv, t, s, dir, isGone, act, actDur) {
    this.x = x;
    this.y = y;
    this.xv = xv;
    this.yv = yv;
    
    this.tick = t;
    this.state = s;
    this.direction = dir;
    this.isGone = isGone;
    this.action = act;
    this.actionDuration = actDur;
    
    this.width = 30;
    this.height = 10;
    this.X_FLY_MAX = 200;
    this.Y_FLY_MAX = 100;
    this.FLY_MIN = 20;
    this.FLY_MAX = 50
    this.IDLE_MIN = 5;
    this.IDLE_MAX = 150;
    
    this.img = new Image();
    
    this.update = function() {
        
        // Assigning new action if previous action has ended
        if(this.actionDuration <= 0) {
            
            // Assign idling
            if(this.action == "flying") {
                this.action = "idling";
                this.xv = 0;
                this.yv = 0;
                
                if(flies.length > 0)
                    this.actionDuration = this.IDLE_MIN;
                else
                    this.actionDuration = getRandomInt(this.IDLE_MIN, this.IDLE_MAX);
            }
            
            // Assign flying
            else if(this.action == "idling") {
                this.action = "flying";
                
                let x, y;
                
                // Chase a fly if exists
                if(flies.length > 0) {
                    
                    let min = distance(this.x, this.y, flies[0].x, flies[0].y);
                    let ci = 0;
                    for(let i = 1; i < flies.length; i++) {
                        let curr = distance(this.x, this.y, flies[i].x, flies[i].y);
                        if(curr < min) {
                            min = curr;
                            ci = i;
                        }
                    }
                    
                    x = (flies[ci].x+flies[ci].width/2) - (this.x+this.width/2);
                    if(x < -this.X_FLY_MAX) x = -this.X_FLY_MAX;
                    else if(x > this.X_FLY_MAX) x = this.X_FLY_MAX; 
                    y = (flies[ci].y+flies[ci].height/2) - (this.y+this.height/2);
                    if(y < -this.Y_FLY_MAX) y = -this.Y_FLY_MAX;
                    else if(y > this.Y_FLY_MAX) y = this.Y_FLY_MAX;
                    
                // Wander if flies do not exist
                } else {
                    let xMin = -this.X_FLY_MAX;
                    if(this.x+xMin < 0) xMin = 0;
                    let xMax = this.X_FLY_MAX;
                    if(this.x+xMax > canvas.width-this.width)
                        xMax = canvas.width-this.width - (this.x+xMax);
                    x = getRandomInt(xMin, xMax);

                    let yMin = -this.Y_FLY_MAX;
                    if(this.y+yMin < 0) yMin = 0;
                    let yMax = this.Y_FLY_MAX;
                    if(this.y+yMax > canvas.width-this.width)
                        yMax = canvas.width-this.width - (this.y+yMax);
                    y = getRandomInt(yMin, yMax);
                }
                
                this.actionDuration = getRandomInt(this.FLY_MIN, this.FLY_MAX);
                this.xv = x/this.actionDuration;
                this.yv = y/this.actionDuration;

                if(this.xv < 0) this.direction = "left";
                else this.direction = "right"
            }
        }
        
        // Applying velocity to position
        this.x += this.xv;
        this.y += this.yv;
        
        // Applying position bounds
        if(this.x < 0) this.x = 0;
        if(this.x > canvas.width-this.width) this.x = canvas.width-this.width;
        if(this.y < 0) this.y = 0;
        if(this.y > canvas.height-this.height) this.y = canvas.height-this.height;
        
        // Tick increment
        this.tick++;
        this.actionDuration--;
        this.state = this.tick%4+1;
        
        // Drawing image
        switch(this.state) {
            case 1:
                if(this.direction == "left")
                    this.img.src = "../images/dragonfly1f.png";
                else this.img.src = "../images/dragonfly1.png";
                break;
            case 2:
                if(this.direction == "left")
                    this.img.src = "../images/dragonfly2f.png";
                else this.img.src = "../images/dragonfly2.png";
                break;
            case 3:
                if(this.direction == "left")
                    this.img.src = "../images/dragonfly3f.png";
                else this.img.src = "../images/dragonfly3.png";
                break;
            case 4:
                if(this.direction == "left")
                    this.img.src = "../images/dragonfly4f.png";
                else this.img.src = "../images/dragonfly4.png";
                break;
        }
        context.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

function spawnDragonfly() {
    if(dragonflies.length > 20) return;
    let x = canvas.width-90;
    let y = canvas.height-45;
    dragonflies.push(new Dragonfly(x, y, 0, 0, 0, 1, "right", false, "idling", 0));
}

function removeDragonfly() {
    dragonflies.pop();
}

function Fly(x, y, xv, yv, t, s, dir, isDead, act, actDur) {
    this.x = x;
    this.y = y;
    this.xv = xv;
    this.yv = yv;
    
    this.tick = t;
    this.state = s;
    this.direction = dir;
    this.isDead = isDead;
    this.action = act;
    this.actionDuration = actDur;
    
    this.width = 8;
    this.height = 8;
    this.X_FLY_MAX = 40;
    this.Y_FLY_MAX = 40;
    this.FLY_MIN = 5;
    this.FLY_MAX = 30;
    this.IDLE_MIN = 5;
    this.IDLE_MAX = 10;
    
    this.img = new Image();
    
    this.update = function() {
        
        // Checking if it has been caught
        dragonflies.every(dragonfly => {
            if(Math.abs(this.x-dragonfly.x) <= dragonfly.width/2+this.width/2
               && Math.abs(this.y-dragonfly.y) <= dragonfly.height/2+this.height/2) {
                this.isDead = true;
                return;
            } else return true;
        });
        
        // Assigning new action if previous action has ended
        if(this.actionDuration <= 0) {
            
            // Assign idling
            if(this.action == "flying") {
                this.action = "idling";
                this.xv = 0;
                this.yv = 0;
                this.actionDuration = getRandomInt(this.IDLE_MIN, this.IDLE_MAX);
            }
            
            // Assign flying
            else if(this.action == "idling") {
                this.action = "flying";
                
                let xMin = -this.X_FLY_MAX;
                if(this.x+xMin < 0) xMin = 0;
                let xMax = this.X_FLY_MAX;
                if(this.x+xMax > canvas.width-this.width)
                    xMax = canvas.width-this.width - (this.x+xMax);
                let x = getRandomInt(xMin, xMax);
                
                let y;
                if(this.y > canvas.height*0.67) {
                    y = -this.Y_FLY_MAX;
                } else {
                    let yMin = -this.Y_FLY_MAX;
                    if(this.y+yMin < 0) yMin = 0;
                    let yMax = this.Y_FLY_MAX;
                    if(this.y+yMax > canvas.width-this.width)
                        yMax = canvas.width-this.width - (this.y+yMax);
                    y = getRandomInt(yMin, yMax);
                }
                
                this.actionDuration = getRandomInt(this.FLY_MIN, this.FLY_MAX);
                this.xv = x/this.actionDuration;
                this.yv = y/this.actionDuration;
                
                if(this.xv < 0) this.direction = "left";
                else this.direction = "right"
            }
        }
        
        // Applying velocity to position
        this.x += this.xv;
        this.y += this.yv;
        
        // Applying position bounds
        if(this.x < 0) this.x = 0;
        if(this.x > canvas.width-this.width) this.x = canvas.width-this.width;
        if(this.y < 0) this.y = 0;
        if(this.y > canvas.height-this.height) this.y = canvas.height-this.height;
        
        // Tick increment
        this.tick++;
        this.actionDuration--;
        this.state = this.tick%4+1;
        
        // Drawing image
        switch(this.state) {
            case 1:
                this.img.src = "../images/fly1.png";
                break;
            case 2:
                this.img.src = "../images/fly2.png";
                break;
            case 3:
                this.img.src = "../images/fly3.png";
                break;
            case 4:
                this.img.src = "../images/fly4.png";
                break;
        }
        context.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

function spawnFly() {
    if(flies.length > 100) return;
    let x = canvas.width-123;
    let y = canvas.height-40;
    flies.push(new Fly(x, y, 0, 0, 0, 1, "right", false, "idling", 0));
}

function openBox() {
    let btnTxt = document.getElementById("boxBtn").innerHTML;
    if(boxOpen == "true") {
        document.getElementById("flyBtn").style.visibility = "hidden";
        document.getElementById("dragonflyBtn").style.visibility = "hidden";
        document.getElementById("catchBtn").style.visibility = "hidden";
        
        // Set new box image
        let img = document.getElementById("boxBtnImg");
        img.setAttribute("src", "../images/box_closed.png");
        
        boxOpen = "false";
        
    } else {
        document.getElementById("flyBtn").style.visibility = "visible";
        document.getElementById("dragonflyBtn").style.visibility = "visible";
        document.getElementById("catchBtn").style.visibility = "visible";
        
        // Set new box image
        let img = document.getElementById("boxBtnImg");
        img.setAttribute("src", "../images/box_open.png");
        
        boxOpen = "true";
    }
}

// Returns a bounded random integer (min is inclusive; max is exclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Returns the distance between two points
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}
