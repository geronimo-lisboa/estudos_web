//Minha engine de brinquedo para entender webgl e javascript
function ToyEngine(aCanvas){
  //A canvas que a engine vai usar
  this.canvas = aCanvas;
  
  //Função que inicia o opengl.
  this.initOpenGL = function(){
    console.log('init opengl');
    //Cria o contexto de webgl2
    var _gl = this.canvas.getContext("webgl2");
	//Flags do contexto:
	_gl.enable(_gl.DEPTH_TEST);
	_gl.depthFunc(_gl.LESS);
    //tentativa de previnir context lost
    this.canvas.addEventListener("webglcontextlost", function(event){
      event.preventDefault();
    },false);
	return _gl;
  }
  //Seta a viewport do opengl para o tamanho da canvas
  this.initViewport = function(){
	  this.gl.viewport(0,0, this.canvas.width, this.canvas.height);
  }
  //O contexto opengl 
  this.gl = this.initOpenGL();
  
}