const mongoose=require("mongoose");
const BookSchema=mongoose.Schema(
    {

        ISBN:String,
        Title:String,
        PubDate:String,
        language:String,
        numPage:Number,
        author:[Number],
        publications:[Number],
        category:[String]
    }
);
const BooksModel = mongoose.model("books",BookSchema) ;
module.exports=   // mongoose.models.BooksModel || mongoose.model('books', BookSchema);
BooksModel;