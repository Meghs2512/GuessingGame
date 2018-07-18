function generateWinningNumber()
{
    var newNumber=Math.random();
    var randomNumber=Math.floor(newNumber*100)+1;

    if (Number(randomNumber)==0)
        return 1;
    return Number(randomNumber);
}

function shuffle(arr)
{
        var len = arr.length, tempElement, index;
        // While there remain elements to shuffle…
        while (len) 
        {
         // Pick a remaining element…
          index = Math.floor(Math.random() * len--);
      
          // And swap it with the current element.
          tempElement = arr[len];
          arr[len] = arr[index];
          arr[index] = tempElement;
        }
        return arr;
}

function Game()
{
    this.playersGuess= null;
    this.pastGuesses=[];
    this.winningNumber=generateWinningNumber();
}
Game.prototype.difference=function()
{
    return Math.abs(this.winningNumber-this.playersGuess);
}
Game.prototype.isLower=function()
{
    if(this.playersGuess<this.winningNumber)
        return true;
    else    
        return false;
}
Game.prototype.playersGuessSubmission=function(newGuess)
{
    if(newGuess< 1 || newGuess > 100 || typeof newGuess !== 'number'|| isNaN(newGuess)===true)
        return "That is an invalid guess."        
    this.playersGuess=newGuess;
    return this.checkGuess();
}
Game.prototype.checkGuess=function()
{    
    var diffGuess;
    if(this.playersGuess===this.winningNumber)
    {
        $('#submit, #hint').prop('disabled',true);
        $('#subtitle').text('Press the Reset button to play again!..');
        return 'You Win!'
    }
    else
    {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1 )
            return 'You have already guessed that number.';
        else
        {
            this.pastGuesses.push(this.playersGuess);
            $('#guest-list li:nth-child(' + this.pastGuesses.length +')').text(this.playersGuess);
            if(this.pastGuesses.length===5)
            {
                $('#submit, #hint').prop('disabled',true);
                $('#result').text('Press the Reset button to play again!..');
                return 'You Lose. The Winning number is '+this.winningNumber;
            }
            else
            {
                diffGuess=this.difference();
                if(this.isLower())
                    $('#subtitle').text('Guess Higher..');
                else    
                    $('#subtitle').text('Guess Lower..');

                if(diffGuess<10)
                    return 'You\'re burning up!';
                else if(diffGuess<25)
                    return 'You\'re lukewarm.';
                else if(diffGuess<50)
                    return 'You\'re a bit chilly.';
                else
                    return 'You\'re ice cold!';
            }
        }
    }
}
function newGame()
{
    var game=new Game();
    return game;
}
Game.prototype.provideHint=function()
{    
    
    var hintArray=[];
    hintArray.push(this.winningNumber);
    for(var i=0;i<2;i++)
    {
           hintArray.push(generateWinningNumber());
    }
    return shuffle(hintArray);
}
// Jquery attached to html n javascript
function userGuess(game)
{
    var inputUserGuess= $('#inputtext').val();
    $('#inputtext').val('');
    var result= game.playersGuessSubmission(parseInt(inputUserGuess,10));
    $('#result').text(result);
      
}
$(document).ready(function(){
    var game=new Game();
    var hintCount=0;
    $('#submit').click(function(e){
             userGuess(game);
             $('#title').text('Play the Guessing Game!');

    });

    $('#inputtext').keypress(function(event)
    {
        // 13 is ascii for ENTER key
        if(event.which==13)
        userGuess(game);
    })

    $('#reset').click(function(){
         game=newGame();
         $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!');
        $('#inputtext').text('#');
        $('#result').text('');
        $('#submit').prop('disabled',false);
        $('#hint').prop('disabled',false);
        $('#hint').text('Hint');
        $('.guesses').text('-');
        hintCount=0;
    });

    $('#hint').click(function (){
       
        hintCount++;
        if(hintCount==1)
        {
            var hint=game.provideHint();
            $('#title').text('Winning Numbers are '+ hint[0] +', '+ hint[1]+' or '+ hint[2]);
            $('#hint').prop('disabled',true);
        }
    });
});

