import express from 'express'
import {PORT, SECRET_JWT_KEY} from './config.js'
import { UserRepository } from './Autenticacion_check-main/user-repository.js';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';

const app=express();
app.use(express.json());
app.use(cookieParser())
app.use(express.static('public'));

//inicio middleware
app.use((req,res,next)=>{
    const token =req.cookies.access_token
    req.session={user: null}
    try{
        const data=jwt.verify(token,SECRET_JWT_KEY)
        req.session.user=data
    }catch(error){
        req.session.user=null
    }
    next() // seguir a la siguiente ruta o middleware.
})

app.set('view engine','ejs')
//Endpoints
app.get('/',(req,res)=>{
    const {user}=req.session
    res.render('index',user)
});   

app.get('/home', (req, res) => {
    const { user } = req.session;
    console.log("Usuario en la sesión al acceder a /home:", user);

    if (!user) {
        return res.redirect('/'); // Redirigir al login si no hay sesión
    }
    res.render('home', { username: user.username });
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Intentando iniciar sesión...");
        const user = await UserRepository.login({ username, password });
        console.log("Usuario autenticado");

        const token = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_JWT_KEY,
            { expiresIn: '1h' }
        );

        // Guardar el usuario en la sesión
        req.session.user = { id: user._id, username: user.username };

        // Configurar la cookie con el token
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60, // 1 hora
        });

        // Redirigir a la página de inicio (home.ejs)
        res.redirect('/home');
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        res.status(401).send("Credenciales incorrectas");
    }
});

app.post('/register', async (req,res)=>{
    //aqui el body es el cuerpo de la petición
    const {username,password}=req.body
    console.log(req.body)
    try{
        const id= await UserRepository.create({username,password});
        res.send({id})
    }catch(error){
        //No es buena idea mandar el error del repositorio
        res.status(400).send(error.message)
    }
});
app.post('/logout',(req,res)=>{
    res
    .clearCookie('access_token')
    .json({message:'logout successfull'})
    .send('logout');
});

app.get('/protected',(req,res)=>{
    const {user}=req.session
    if (!user) return res.status(403).send('acceso no autorizado')
    res.render('protected',user)
});

app.get('/admin', (req, res) => {
    const { user } = req.session; // Verifica si hay un usuario en la sesión
    if (!user) {
        return res.redirect('/'); // Redirige al login si no hay sesión
    }
    res.render('admin', { username: user.username }); // Renderiza admin.ejs con el nombre del usuario
});

app.listen(PORT,()=>{
    console.log(`Server running on port${PORT}`);
});