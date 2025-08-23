var minutes = 0;
var seconds = 30;
var progress = document.getElementById("progress");
var time = document.getElementById("time");
var points = 0;
var end_screen = document.getElementById("end_screen");
var score = document.getElementById("score");
var best_score = document.getElementById("best_score");
var grid = document.getElementById("Grid");
var global_num_cells = 0;

initialise();

function initialise(){
    end_screen.style.visibility = "hidden";
    timer();
    Begin(); 
}

function Begin(){
    var unlock_audio = document.getElementById("unlock_audio");
    var wrong_audio = document.getElementById("wrong_audio");
    var right_audio = document.getElementById("right_audio");
    var lose_audio = document.getElementById("lose_audio");
    var chosen_ids = []; 
    var found = [];
    var counter = 0;
    var wrong_count = 0;
    var found_count = 0;

    var rand =  Math.floor(Math.random() * (10-5) + 5);
    var num_cells = rand * rand;
    global_num_cells = num_cells;
    var wrong_permit = Math.floor(num_cells/10)
    var num_chosen = Math.floor(num_cells/5);

    while (counter < num_chosen) {
        const random = Math.floor(Math.random() * num_cells);
        if (!chosen_ids.includes(random)) {
            chosen_ids.push(random);
            counter++;
        }
    }

    for (let i = 0; i < num_cells; i++){
        var div = document.createElement("div");
        div.id = i;
        grid.append(div);
    }

    grid.style.gridTemplateColumns = `repeat(${rand}, 50px)`;

    for (c = 0; c < num_chosen; c++){
        document.getElementById(chosen_ids[c]).style.backgroundColor = "yellow";
    }

    setTimeout(() => {
        for (d = 0; d < num_chosen; d++){
            document.getElementById(chosen_ids[d]).style.backgroundColor = "#f1f1f1";
        }
        for (let y = 0; y < num_cells; y++){

            document.getElementById(y).addEventListener("click", () => {
                if (chosen_ids.includes(y) && !found.includes(y) && wrong_count < wrong_permit) {
                    if (found_count < (num_chosen-1)){
                        right_audio.play();
                        chosen_ids.splice(chosen_ids.indexOf(y), 1);
                        found.push(y);
                        document.getElementById(y).style.backgroundColor = "blue";
                        points += 1;
                        found_count += 1;
                    }
                    else{
                        unlock_audio.play();
                        document.getElementById(y).style.backgroundColor = "blue";
                        setTimeout(() => {
                            for (f = 0; f < num_cells; f ++){
                                cell = document.getElementById(f);
                                grid.removeChild(cell)
                            }
                            Begin();
                        }, 1500);
                    }
                }
                if (!chosen_ids.includes(y) && !found.includes(y) && found_count < (num_chosen-1)) {
                    
                    if (wrong_count < wrong_permit){
                        wrong_audio.play();
                        document.getElementById(y).style.backgroundColor = "red";
                        wrong_count += 1;
                    }
                    
                    if (wrong_count == wrong_permit){
                        wrong_count += 1;
                        lose_audio.play();
                        document.getElementById(y).style.backgroundColor = "red";
    
                        setTimeout(() => {
                            for (z = 0; z < num_cells; z ++){
                                cell = document.getElementById(z);
                                grid.removeChild(cell)
                            }
                            Begin();
                        }, 1500);
                    }
                }
    
                document.getElementById("points").innerHTML = points;
            });
        }
        
    }, 5000);
}

function timer(){
    interval = setInterval(decrease, 1000);
    total = seconds + (minutes * 60);
    one_second_percentage = 1/(total/100)

    function decrease(){
        if (seconds > -1){
            seconds -= 1
        }
        if (seconds == -1 && minutes > -1){
            minutes -= 1;
            seconds = 59;
        }
       
        if (minutes <= 0 && seconds <= 0){
            clearInterval(interval);
            end_screen.style.visibility = "visible";
            score.innerHTML = "Score: " + points;
            points = 0;
            minutes = 0;
            seconds = 30;
            for (z = 0; z < global_num_cells; z ++){
                cell = document.getElementById(z);
                grid.removeChild(cell)
            }
            global_num_cells = 0;
        }
        progress.value -= one_second_percentage;
        time.innerHTML = minutes + ":" + seconds;
    }
} 