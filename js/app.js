
const express  = require('express'); 
const productManager = require("./productManager")

const app = express()
const port = 8000;

app.get('/ping',(req,res) =>{
    res.send('pong')
})

app.get('/product',async (req,res) =>{
    const limit = parseInt(req.query.limit) || null;
    if(limit){
        res.send( await productManager.getProductByLimit(limit))
    }else{
        res.send( await productManager.getProducts())
    }
})

app.get('/product/:id', async (req,res) =>{
    let id = parseInt(req.params.id);
    res.send(await productManager.getProductById(id))
})

app.listen(port,() => console.log('servidor arriba' + Date()))
