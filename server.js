import express from "express";
import bodyParser from "body-parser";
import session  from "express-session";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";



let app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())

let jwtSecret = "thisismyjwtsecret"

// app.use(session({
//     name : "sid",
//     resave : false,
//     saveUninitialized : false,
//     secret : "this_is_my_secret_key",
//     cookie:{
//         maxAge : 1000 * 30
//     }
// }))
// middleware which will check user's session exist or not
// const requireAuth = (req,res,next)=>{
//     //if session has expired or user not logged in 
//     if(!req.session || !req.session.username){
//         return res.redirect("/login")
//     }
//     next()
// }

function verifyToken(req,res,next){
    const token = req.cookies.token 

    if(!token){
        return res.status(401).send("Token NOT found")
    }

    //verify 
    jwt.verify(token,jwtSecret,(err,decoded)=>{
        if(err){
            return res.status(403).send("Invalid or expired token")
        }
        req.user = decoded;

        next()
    })

}



let users = [
    {username:"shaan",password:"123456"}
]





// /login get

app.get("/login",(req,res)=>{
    res.send(`
        <h1>Login</h1>
        <form action="/login" method="POST">
            username : <input type="text" name="username" />
            password : <input type="password" name="password" />
            <button type="submit" >Login</button>
        </form>
        `)
})

// /login post

app.post("/login",(req,res)=>{
    console.log(req.body)
    let {username,password} = req.body
    if(username && password){
        let user = users.find((u)=>u.username == username 
        && u.password == password )
        if(user){
            // session
            // req.session.username = username 
            //creating jwt
            const token = jwt.sign({
                username : username
            },jwtSecret,{
                expiresIn : "10s"
            })
            console.log(token)
            // setting token inside cookie

            res.cookie("token",token,{
                httponly : true,
                maxAge : 1000 * 40 
            })

           return res.redirect("/home")
        }
    }
    res.redirect("/login")
})

app.get("/home",verifyToken,(req,res)=>{
    res.send(`
        <h1>Welcome user</h1>
        <a href="/logout" >Logout</a>
        `)
})

app.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
            return res.redirect("/home")
        }
        res.clearCookie("sid")
        res.redirect("/login")
    })
})


app.listen(3055,()=>{
    console.log("Server is running on http://localhost:3055/login")
})