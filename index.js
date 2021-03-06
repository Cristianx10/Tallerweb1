// importar el módulo express
var express = require('express');
var motorRender = require('express-handlebars');

var fs = require('fs');

// crear la variable app usando express
var app = express();

// configurar la carpeta public como "pública"
app.use(express.static('public'));

app.engine('handlebars', motorRender());
app.set('view engine', 'handlebars');


const MongoClient = require("mongodb").MongoClient;
const test = require("assert");
// Connection url
const url = "mongodb://localhost:27017";
// db Name
const dbName = "tienda";
var db;

// Connect using MongoClient
MongoClient.connect(
  "mongodb+srv://cluster0-fzzne.mongodb.net/tienda",
  {
auth:{
  user:"cariitoc98",
  password:"cariitoc98",

}
  }, function (err, client) {
  db = client.db(dbName);

  app.listen(process.env.PORT || 1234);

  //client.close();
});



var productos = [];
productos.push({
  titulo: 'nevermine',
  precio: '85714312312',
  imagen: '/images/baby.png',
  descripcion: 'Si te has decidido a tener un perro, seguro que antes de comprar –o mejor, adoptar- a tu nueva mascota, tendrás qué decidir qué raza prefieres en función de tu modo de vida y tu propia personalidad. Hay perros de carácter más agresivo o dominante, otros mansos y alegres, algunos necesitan mucho espacio para correr y jugar, otros son más tranquilos…',
  disponible: true,
});
productos.push({
  titulo: 'Gato',
  precio: '8571431231200000',
  imagen: 'https://www.feelcats.com/blog/wp-content/uploads/2018/10/gato-atigrado.jpg',
  descripcion: 'Esa preciosa combinación de patrones jaspeados, moteados o rayados en diferentes tonos, nos da a la idea de una genética caprichosa, que te contaremos, en este original artículo sobre ellos, pero además nos adentraremos en su carácter y peculiaridades, de estos gatos atigrados tan comunes, pero a la vez, tan únicos. ¿empezamos?',
  disponible: false,
});

// configurar la ruta inicial

// configurar la ruta portafolio
app.get('/tienda', function (request, response) {

  let contexto = {};
  let coleccion = db.collection("productos");

  coleccion.find({}).toArray(function (err, items) {
    test.equal(null, err);
    contexto.productos = items;
    response.render('tienda', contexto);
  });

});

app.get("/carrito", function(request, response) {
  response.render("carrito", {});
});

app.get("/music", function(request, response) {
  response.render("music", {});
});

app.get("/checkout", function(request, response) {
  response.render("checkout", {});
});

app.get('/temporada/:item?', function (request, response) {

  let contexto = {};
  let item = request.params.item;

  let query = {};

  if(item != null){
    query.vendidos = item;
  }

  let coleccion = db.collection("productos");

  coleccion.find(query).toArray(function (err, items) {
    test.equal(null, err);
    contexto.productos = items;
    response.render('tienda', contexto);
  });

});

app.get('/precio/:item?', function (request, response) {

  let contexto = {};
  let item = request.params.item;

  let query = {};

  if(item != null){
    query.precio = item;
  }

  let coleccion = db.collection("productos");

  coleccion.find(query).toArray(function (err, items) {
    test.equal(null, err);
    contexto.productos = items;
    response.render('tienda', contexto);
  });

});

app.get('/categoria/:item?', function (request, response) {

  let contexto = {};
  let item = request.params.item;

  let query = {};

  if(item != null){
    query.categoria = item;
  }

  let coleccion = db.collection("productos");

  coleccion.find(query).toArray(function (err, items) {
    test.equal(null, err);
    contexto.productos = items;
    response.render('tienda', contexto);
  });

});

app.get('/producto/:item?', function (request, response) {

  let contexto = {};
  let item = request.params.item;

  let query = {};

  if(item != null){
    query.nombre = item;
  }

  let coleccion = db.collection("productos");

  coleccion.find(query).toArray(function (err, items) {
    test.equal(null, err);
    contexto = items;
    response.render('producto', contexto[0]);
  });

});


/**Envio de formulario---------------------------------------------------------------------------------- */

app.post("/pagar", function(request, response) {
  // crear un archivo con la información del usuario
  console.log(request.body);

  /*
  let productos = JSON.parse(request.body.productos);
  console.log(productos)
  if(productos == null || productos == undefined){
    productos = [];
  }*/

  var pedido = {
    nombre: request.body.nombre,
    correo: request.body.correo,
    direccion: request.body.direccion,
    telefono: request.body.telefono,
    fecha: new Date(),
    estado: "Pendiente"
  };

  var collection = db.collection("pedidos");
  collection.insertOne(pedido, function(err) {
    assert.equal(err, null);

    console.log("pedido guardado");
    response.redirect("/tienda");
  });
 
});

// iniciar el servidor en el puerto 3000
app.listen(3000, function () {
  console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});