const fs  = require("fs")

class productManager{
    static id = 0;        

    constructor (){
        this.path = './archivo.txt';
        this.products= [];
    }

    validateData(tittle,description,price,thumbnail,code,stock){
        let mensajes = this.controlDatos(tittle,"String");
        mensajes += this.controlDatos(description,"String");
        mensajes += this.controlDatos(price,"Number");
        mensajes += this.controlDatos(thumbnail,"String");
        mensajes += this.controlDatos(code,"String");
        mensajes += this.controlDatos(stock,"Number");
        mensajes += this.getFindByCode(code);
        return mensajes;
    }

    controlDatos(variable,tipo) {
        //? controla cada campo que este cargado
        if (variable === null || variable === undefined || variable === '') {
            return "No ingreso dato \n";
        }
        switch (tipo) {
            case "String":
                if(variable.length<3) return "Debe ser mayor a 3 digitos\n";
                break;
            case "Number":
                if(!this.EsNumerico(variable))  return "No Es un numero\n";
                break;
            default:
                break;
        }
        return '';
    }

    EsNumerico(numero){
        let valor = parseInt(numero);
        if(typeof(valor) != "number"){
            return false;
        }
        return true;
    }

    addProduct(tittle,description,price,thumbnail,code,stock){
        let mensaje = this.validateData(tittle,description,price,thumbnail,code,stock);
        if(mensaje == ''){
            productManager.id++;
            this.products.push({tittle,description,price,thumbnail,code,stock,id: productManager.id});
            this.addFile(this.path,this.products,'Se inserto el registro');
        }else{
            console.log(`Mensaje de error: ${mensaje}`);
        }
    }

    delArchivo = async() => {
        await fs.promises.unlink(this.path)
        ;
    }

    updProduct(tittle,description,price,thumbnail,code,stock,id,productos){
        let productsOld =productos;
        let mensaje = this.validateData(tittle,description,price,thumbnail,code,stock);
        if(mensaje == ''){
            for (let index = 0; index < productsOld.length; index++) {
                if(productsOld[index].id === id)    productsOld[index] = {tittle,description,price,thumbnail,code,stock,id};
             }
             this.addFile(this.path,productsOld,'Se actualizo el registro');             
        }else{
            return `Mensaje de error: ${mensaje}`;
        }

    }

    readProducts = async()=>{
        let resultado = await fs.promises.readFile(this.path,"utf-8")
                                         .catch(()=> 'No hay Datos');            
        if(resultado) return JSON.parse(resultado);
        return '';
    }

    getProducts = async ()=> {
       let productos = await this.readProducts();
       return productos;
    }

    readProductByID= async(id) => {
        let producto =  await this.readProducts();
        if (producto) return producto.some(x=> x.id === id) ?  producto.find(x=> x.id === id) : `Id Not Found ${id}`;
    }


    getFindByCode= (code) => {
        let producto = this.products;
        return producto.some(x=> x.code === code) ? `codigo repetido ${code}` : '';
    }

    readProductWhitOutID= async(id) => {
        let producto =  await this.readProducts();
        if (producto) return producto.filter(x=> x.id !== id);
        return '';
    }

    getProductById = async(id) => {
        let producto =  await this.readProductByID(id);
        if(producto) return producto;
        return '';
    }

    getProductByLimit = async(limit) => {
        let producto =  await this.readProducts();
        if (producto) return producto.slice(0,limit);
        return '';
    }



    addFile = async (archivo,registro,mensaje)=>{
        let log =JSON.stringify(registro);
        await fs.promises.writeFile(archivo, log)
            .then(() => console.log(`${mensaje}`))
            .catch((err) => console.log(err))
    }

    deleteProduct = async(id) =>{
        let producto =  await this.readProductWhitOutID(id);
        if(producto) this.addFile(this.path,producto, `Elimino Id ${id}`);
    }

    updateProduct = async(tittle,description,price,thumbnail,code,stock,id) =>{        
        let productos =  await this.readProducts();
        await this.updProduct(tittle,description,price,thumbnail,code,stock,id,productos);
     }
}

module.exports = new productManager();

//? Test
//let productoNuevo = new productManager();
//productoNuevo.delArchivo();

// productoNuevo.addProduct('producto prueba1','Este es un producto prueba1',200,'Sin imagen1','abc123',25);
// productoNuevo.addProduct('producto prueba2','Este es un producto prueba2',200,'Sin imagen2','abc124',25);
// productoNuevo.addProduct('producto prueba3','Este es un producto prueba3',200,'Sin imagen3','abc121',25);
// productoNuevo.addProduct('producto prueba3','Este es un producto prueba3',200,'Sin imagen3','abc123',25); //codigo duplicado

//productoNuevo.getProducts();

//productoNuevo.getProductById(1);
// productoNuevo.getProductById(5);

//productoNuevo.deleteProduct(3);

//productoNuevo.updateProduct('producto prueba2','Este es un producto prueba2',400,'Sin','abc124',25,2);
//productoNuevo.updateProduct('prueba1','Este es un producto prueba1',200,'Sin imagen1','abc123',125,1);

