const path = require('path')
const mongodb = require('mongodb')
const express = require('express')
const session = require('express-session')
const app = express()
app.use(session({secret:'XASDASDA'}));

app.use(express.json())
app.use(express.urlencoded())

var ssn={
  username:0
};

// /Users/"Raushan kumar"/mongodb/bin/mongod.exe --dbpath=/Users/"Raushan kumar"/mongodb-data
// nodemon try1.js -e js,html
// npm install express-session
// npm install -g nodemon
// npm i express@4.16.4
//

const publicDirectoryPath = path.join(__dirname, '/public')

app.use(express.static(publicDirectoryPath))

const MongoClient = mongodb.MongoClient
const connectionUrl='mongodb+srv://raushan303:8800903453@cluster0.s9gwb.mongodb.net/table?retryWrites=true&w=majority'
const databaseName = 'table'

var auth = (req,res,next)=>{
    console.log(ssn.username)
   if(!ssn.username)
   {    
       res.send('You are not authorized to view!')
   }
   else
   {
        next()
   }
}

app.post('/logout', (req, res) => {
       ssn.username=0;
       res.sendfile('signin.html')
})

app.get('/additem',auth, (req, res) => {
    //console.log(JSON.parse(req.query.raushan))
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true },{ useNewUrlParser:true },(error,client)=>{

        if(error)
        {
           return console.log('not connected')
        }
        const db=client.db(databaseName)
        db.collection(ssn.username).insertOne(JSON.parse(req.query.obj))
    })
})

app.get('/deleteItem',auth,(req,res)=>{
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true },{ useNewUrlParser:true },(error,client)=>{

        if(error)
        {
           return console.log('not connected')
        }
        const db=client.db(databaseName)
        console.log(req.query.type,req.query.ID)
        db.collection(ssn.username).deleteOne({type:req.query.type, id:Number(req.query.ID)})
    })
})

app.get('/getItem', auth,(req, res) => {
    //console.log(JSON.parse(req.query.raushan))
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true },{ useNewUrlParser:true },(error,client)=>{
        if(error)
        {
           return console.log('not connected',error)
        }
        const db=client.db(databaseName)
    
    //   console.log(ssn.username)
     db.collection(ssn.username).find({}).toArray((err,result)=>{
        // console.log(result)
        res.send(result)
     })
     })
})


app.get('/home',auth,(req,res)=>{
    res.sendfile("bud.html")
})

app.post('/signup',(req,res)=>{
    console.log(req.body)
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true },{ useNewUrlParser:true },(error,client)=>{

        if(error)
        {
            return console.log('not connected')
        }
                
                const db=client.db(databaseName)
        db.collection('users').find({}).toArray().then((data)=>{
            let check=1
            for(let i=0;i<data.length;i++)
            {
                if(data[i].username===req.body.username)
                {
                    res.send('this username has already been taken!!')
                    check=0
                    break
                }
            }
            if(check)
            {
                ssn = req.session;
                ssn.username=req.body.username;
                db.collection('users').insertOne(req.body)
                //db.collection(req.body.username).insertOne(req.body)
                res.redirect('/home')
            }
         })
    })
})



app.post('/signin',(req,res)=>{
    
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true },{ useNewUrlParser:true },(error,client)=>{
        console.log(req.body)
        if(error)
        {
            return console.log('not connected',error)
        }
        const db=client.db(databaseName)

        db.collection('users').find({}).toArray().then((data)=>{
            let check=1
            for(let i=0;i<data.length;i++)
            {
                if(data[i].username===req.body.username )
                {
                     if(data[i].pass==req.body.pass)
                     {
                        console.log(data[i],req.body)
                        ssn = req.session;
                        ssn.username=req.body.username;
                        check=0
                        console.log('username found!')
                        res.redirect('/home')
                     }
                     else
                     {
                         check=2;
                     }
                     break;
                }
            }
            if(check==1)
            {
                res.send('this username does not exist!!')   
            }
            if(check==2)
            {
                res.send('wrong password!')
            }   
        })        
    })
})

const port=process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up on port 3000.')
})



