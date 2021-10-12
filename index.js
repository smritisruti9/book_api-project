require("dotenv").config();
const express=require("express");
const mongoose =require("mongoose");
var bodyParser=require ("body-parser");
const { restart } = require("nodemon");
const database=require("./database/database");
const BookModel=require("./database/book");
const AuthorModel=require("./database/author");
const PublicationModel= require("./database/publication");
const { urlencoded, json } = require("express");

const booky=express();
booky.use(bodyParser.urlencoded({extended:true}))
booky.use(bodyParser.json()); 
mongoose.connect(process.env.MONGO_URL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}
).then(()=> console.log("connection established"));
//
booky.get("/",async(req,res)=>{
    const getAllBooks=await BookModel.find();
return res.json(getAllBooks);
});


booky.get("/is/:isbn",async(req,res)=>{
   const getSpecificBook=await BookModel.findOne({ISBN:req.params.isbn})
        if(!getSpecificBook){
            return res.json({error:`No book found for the category of ${req.params.isbn}`})

        }
        return res.json({book:getSpecificBook})
     
});
booky.get("/c/:category",async(req,res)=>{
    const getSpecificBook=await BookModel.findOne({category:req.params.category})
        if(!getSpecificBook){
            return res.json({error:`No book found for the category of ${req.params.category}`})

        }
        return res.json({book:getSpecificBook});
    
});
booky.get("/l/:language",(req,res)=>{
    const getSpecificBook=database.books.filter((book)=>book.language===req.params.language);
    if(getSpecificBook.length===0){
        return res.json({error:`No book available for the language ${req.params.language}`})
    }
    return res.json({book:getSpecificBook});

});
booky.get("/author",async(req,res)=>{
    const getAllAuthors= await AuthorModel.find();
    return res.json(getAllAuthors);
});
booky.get("/author/book/:isbn",(req,res)=>{
    const getSpecificAuthor=database.author.filter((author)=>author.books.includes(req.params.isbn));
    if(getSpecificAuthor.length===0){
        return res.json({error:`No author for the ${req.params.isbn}`});
    
    }
    return res.json({author:getSpecificAuthor});
})
booky.get ("/publications",async(req,res)=>
{
    const getAllPublications=await PublicationModel.find();
    return res.json(getAllPublications);
});
booky.get("/publications/n/:name",(req,res)=>{
    const getSpecifPublication=database.publication.filter((publication)=>publication.name.includes(req.params.name));
    
    if(getSpecifPublication.length===0){
        return res.json({error:`No pub found for ${req.params.name}`})
    }
    return res.json({publications:getSpecifPublication});
})
booky.get("/publications/book/:isbn",(req,res)=>{
    const getlistofPublication=database.publication.filter((publication)=>publication.books.includes(req.params.isbn));
    if(getlistofPublication.length===0){
        return res.json({error:`can not get ${req.params.isbn}`})
    }
    return res.json({publications:getlistofPublication})
})
//post
booky.post("/book/new",async(req,res)=>{
    const {newBook}=req.body;
    const addNewBook=BookModel.create(newBook);
   
    return res.json({Books:addNewBook,
    message:"Book was added!"});

});
booky.post("/author/new",async(req,res)=>{
    const {newAuthor}=req.body;
   const addNewAuthor=AuthorModel.create(newAuthor);
    return res.json({Author:addNewAuthor,
    message:"added new author"})
})
booky.post("/publication/new",(req,res)=>{
    const newPublication=req.body;
    database.publication.push(newPublication);
    return res.json({updatedPublication:database.publication});
})
/* **************PUT******** */
booky.put("/book/update/:isbn",async(req,res)=> {
    const updatedBook=await BookModel.findOneAndUpdate({ISBN:req.params.isbn},{title:req.body.bookTitle},{new:true});
    return res.json({books:updatedBook});
});
booky.put("/book/author/update/:isbn",async(req,res)=>{
    const updatedBook= await BookModel.findOneAndUpdate({ISBN:req.params.isbn},{$addToset: {authors:req.body.newAuthor}},{new:true});
const updatedAuthor = await AuthorModel.findOneAndUpdate({id:req.body.newAuthor},{$addToSet:{books:req.params.isbn}},
    {new:true});
    return res.json({books:updatedBook,authors:updatedAuthor,message:"new author was added"});
})


booky.put("/publication/update/book/:isbn",(req,res)=>{
    database.publication.forEach((pub)=>{
        if(pub.id===req.body.pubId){
            return pub.books.push(req.params.isbn);
        }
        
    });

database.books.forEach((book)=>{
    if (book.ISBN===req.params.isbn){
    book.publications=req.body.pubId;
}
});
return res.json({
    books:database.books,
    publications:database.publication,
    message:"Successfully Updated"
}
);

});
/*DELETE*/
booky.delete("/book/delete/:isbn",async(req,res)=>{
    const updatedBookDatabase= await BookModel.findOneAndDelete({ISBN:req.params.isbn})
    
    
    return res.json({books:updatedBookDatabase});
});
booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            const newAuthorList=book.author.filter((eachAuthor)=> eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
        }
    })
    //Update the author database
    database.author.forEach((eachAuthor)=>{
        if(eachAuthor.id===parseInt(req.params.authorId)){
            const newBookList=eachAuthor.books.filter((book)=> book !==req.params.isbn)
            eachAuthor.books=newBookList;
        }
        return res.json({
            book:database.books,
            author:database.author,
            message:"Author was deleted"
        })
    })
})
booky.delete("author/delete/:id",(req,res)=>{
    database.author.forEach((eachAuthor)=>{
        if(eachAuthor.id===parseInt(req.params.id)){
            const newAuthList=eachAuthor.id.filter((id)=> id!==req.params.id)
            eachAuthor.id=newAuthList;

        }
        
    })
})

booky.listen(3000,()=>{
    console.log("server is up and running");
});