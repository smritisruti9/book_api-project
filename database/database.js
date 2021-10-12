const books=[{
    ISBN:"12345Book",
    Title:"Tesla",
    PubDate:"2021-08-05",
    language:"en",
    numPage:250,
    author:[1,2],
    publications:[1],
    category:["tech","space","education"]
}]
const author=[{
    id:1,
    name:"Aradhana",
    books:["12345Book","secretBook"]
},
{
    id:2,
    name:"Elon Musk",
    books:["12345Book"]
}]
const publication=[{
    id:1,
    name:"writex",
    books:["12345Book"],
    
},
{
    id:2,
    name:"writex2",
    books:[],
    
}]
module.exports={author,publication};