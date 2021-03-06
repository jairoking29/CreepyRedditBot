require('dotenv').config({path: './process.env'});

const Snoowrap = require('snoowrap');

// Build Snoowrap client
const r = new Snoowrap({
    userAgent: 'CreepyAskredditBot',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});

const parameters = [
    "creepy",
    "creepiest",
    "scary",
    "scariest",
    "paranormal",
    "unexplained",
    "spooky",
    "spookiest",
    "unsettling",
    "unsolved",
    "unresolved",
    "mystery"
]

let relevantResults = [];
let recordOfUsers = {};


setInterval( () =>{
r.getSubreddit("Askreddit").getHot().then((posts) => {

    let authors = [];

    posts.forEach(element => {
        // if(element.title.toLowerCase().indexOf("creepy") !== -1){
        //     console.log(element.title);
        //     if(relevantResults.indexOf(element.url) === -1){
        //         relevantResults.push(element.url);
        //     }
        // }
        for(let i = 0; i < parameters.length; i++){
            if(element.title.toLowerCase().indexOf(parameters[i]) !== -1){
                console.log(element.title);
                if(relevantResults.indexOf(element.url) === -1){
                    relevantResults.push(element.url);
                }
            }
        }
    });

    if(relevantResults.length > 0){


        r.getSubmission('7efxig').fetch().then(post => {
            post.comments.forEach(comment => {
                authors.push(comment.author.name);
                if(!recordOfUsers.hasOwnProperty(comment.author.name.toString())){
                    recordOfUsers[comment.author.name] = [];
                    console.log(recordOfUsers);
                }

                relevantResults.forEach(result => {
                    if(recordOfUsers[comment.author.name].indexOf(result) === -1){
                        r.composeMessage({
                            to: comment.author.name,
                            subject: 'New creepy askreddit! (CreepyAskredditBot)',
                            text: 'New creepy thread! \n\n' + result.toString() 
                        });        
                        recordOfUsers[comment.author.name].push(result.toString());       
                    }
                });
            });
        });
    }
})}, 5000);

function format(array){
    let result = '';
    array.forEach(element => {
        result += element.toString() + '\n\n';
    });
    return result;
}