//Classe de câmera, usada pela ToyEngine, dependente de http://glmatrix.net/
//Para posicionar a câmera deve-se setar os valores de eye, focus e viewUp
//e chamar setView(). Para setar projectionMatrix invoca-se usePerspective ou 
//useOrtho. Para passar pro opengl pega-se os valores de projectionMatrix
//e viewMatrix.
function ToyCamera(){
   this.projectionMatrix = mat4.create();
   this.viewMatrix = mat4.create();
   this.eye = [1.0, 1.0, -5.0];
   this.focus = [0.0, 0.0, 0.0];
   this.viewUp = [0.0, 1.0, 0.0];
   //Seta this.projectionMatrix como uma projeção perspectiva.
   this.usePerspective = function(){
      mat4.perspective(this.projectionMatrix, 45.0, 1.0, 0.1, 100.0);   
   }
   //Seta this.projectionMatrix como uma projeção ortográfica
   this.useOrtho = function(){
       mat4.ortho(this.projectionMatrix, -2, 2, -2, 2, 0.1, 25.0);
   }
   //Seta this.viewMatrix a partir dos valores de eye, focus e viewUp;
   this.setView = function(){
       mat4.lookAt(this.viewMatrix, this.eye, this.focus, this.vUp);   
   }
   this.usePerspective();
   this.setView();
}

//Minha engine de brinquedo para entender webgl e javascript
//A forma de usar é: 1)Criar a classe usando uma canvas. 2)setar a viewport
//via initViewport().
function ToyEngine(aCanvas){
  //A canvas que a engine vai usar
  this.canvas = aCanvas;
  //A câmera (ToyCamera).
  this.camera = new ToyCamera();
  //Função que inicia o opengl. Cria o contexto e seta a função de profundidade
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