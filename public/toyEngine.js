//Classe de câmera, usada pela ToyEngine, dependente de http://glmatrix.net/
//Para posicionar a câmera deve-se setar os valores de eye, focus e viewUp
//e chamar setView(). Para setar projectionMatrix invoca-se usePerspective ou 
//useOrtho. Para passar pro opengl pega-se os valores de projectionMatrix
//e viewMatrix.
//Serve para gerar o componente V e P da matriz MVP, que deve multiplicar
//os vértices no vertex shader.
function ToyCamera() {
    this.projectionMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    this.eye = [1.0, 1.0, -5.0];
    this.focus = [0.0, 0.0, 0.0];
    this.viewUp = [0.0, 1.0, 0.0];
    //Seta this.projectionMatrix como uma projeção perspectiva.
    this.usePerspective = function () {
        mat4.perspective(this.projectionMatrix, 45.0, 1.0, 0.1, 100.0);
    }
    //Seta this.projectionMatrix como uma projeção ortográfica
    this.useOrtho = function () {
        mat4.ortho(this.projectionMatrix, -2, 2, -2, 2, 0.1, 25.0);
    }
    //Seta this.viewMatrix a partir dos valores de eye, focus e viewUp;
    this.setView = function () {
        mat4.lookAt(this.viewMatrix, this.eye, this.focus, this.viewUp);
    }
    this.usePerspective();
    this.setView();
}
//Classe de transformações.
function ToyTransform() {
    this.modelMatrix = mat4.create();
    this.translate = [0.0, 0.0, 0.0];
    this.pivot = [0.0, 0.0, 0, 0];
    this.rotationAxis = [0.0, 1.0, 0.0];
    this.rotationAngle = 0.0; //EM GRAUS
    //Rotation/scaling is around the origin. To both scale/rotate around a pivot, 
    //you apply a negative translation to move the pivot point to the origin, apply 
    //your scale and rotate, and then move your pivot point back. 
    //https://gamedev.stackexchange.com/questions/61473/combining-rotation-scaling-around-a-pivot-with-translation-into-a-matrix
    this.updateMatrix = function () {
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-this.pivot[0], -this.pivot[1], -this.pivot[2]]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotationAngle * 0.0174533, this.rotationAxis);
        mat4.translate(this.modelMatrix, this.modelMatrix, [this.pivot[0], this.pivot[1], this.pivot[2]]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-this.translate[0], -this.translate[1], -this.translate[2]]);
    }
}
//A classe de criação de shader
function ToyShader(toyEngine, vsSrc, fsSrc){
	//Ref. pra engine.
	this.engine = toyEngine;
	//Compila um shader e o retorna
	this.createShader = function(gl, str, type){
		var shader = undefined;
		if(type==="fragment")//Cria como fragment shader 
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		if(type==="vertex")//Cria como vertex shader
			shader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(shader, str);//Seta a fonte
		gl.compileShader(shader);//compila
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){//verifica erro
			throw gl.getShaderInfoLog(shader);
		}
		return shader;
	}
	//A lista de atributos, na forma de "nome"-"id"
	this.attributes = {};
	//A lista de uniforms, na forma de "nome"-"id"
	this.uniforms = {};
	//Cria o programa a partir dos shaders e o retorna. No processo ele 
	//popula a lista de atributos e uniformes.
	this.createProgram = function(gl, vsId, fsId){
		//cria o objeto
		var shaderProgram = gl.createProgram();
		//atacha os shaders
		gl.attachShader(shaderProgram, vsId);
		gl.attachShader(shaderProgram, fsId);
		//linka o programa
		gl.linkProgram(shaderProgram);
		//verifica erro
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			throw gl.getProgramInfoLog(shaderProgram);
		}
		//Pega os atributos e uniforms
		const numAtributos = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
		for(var i=0; i<numAtributos; i++){
			var attrInfo = gl.getActiveAttrib(shaderProgram, i);
			var attrLoc = gl.getAttribLocation(shaderProgram, attrInfo.name);
			this.attributes[attrInfo.name] = attrLoc;
			console.log("atributo - "+attrInfo.name);
		}
		const numUniformes = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
		for(var i=0; i<numUniformes; i++){
			var uniInfo = gl.getActiveUniform(shaderProgram, i);
			var uniLoc = gl.getUniformLocation(shaderProgram, uniInfo.name);
			this.uniforms[uniInfo.name] = uniLoc;
			console.log("uniforme - "+uniInfo.name);
		}
		return shaderProgram;
	}
	//Onde guardo o codigo fonte do shader
	this.vertexShaderSource = vsSrc;
	//Onde guardo o codigo fonte do shader
	this.fragmentShaderSource = fsSrc;
	//Os ids do opengl
	this.vertexShaderId = this.createShader(toyEngine.gl, this.vertexShaderSource, "vertex");
	this.fragmentShaderId = this.createShader(toyEngine.gl, this.fragmentShaderSource, "fragment");
	//o id do programa
	this.programId = this.createProgram(toyEngine.gl, this.vertexShaderId, this.fragmentShaderId);
}

//O objeto 3d. Um objeto 3d tem os buffers necessários para ele existir, tem uma transformação e pode ter outros 
//objetos pendurados a ele.
function Toy3dObject() {
    //A transformação
    this.transform = new ToyTransform();
	
	this.vertexes = undefined;
	this.colors = undefined;
	this.vertexBuffer = undefined;
	this.colorBuffer = undefined;
	this.primtype = undefined;
	this.shaderProgram = undefined;
	
    //Os objetos filhos
    this.children = [];
    //A função de renderização
    this.render = function(gl,camera, parentTranform) {
		//seu render
		if(this.isReady){
		   gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		   gl.useProgram(this.shaderProgram.programId);
		}
		//Render dos filhos
        this.children.forEach(function(element) {
            element.render(camera, this.transform);
        }.bind(this));
    };
	this.isReady = undefined;
}
//Minha engine de brinquedo para entender webgl e javascript
//A forma de usar é: 1)Criar a classe usando uma canvas. 2)setar a viewport
//via initViewport().
function ToyEngine(aCanvas) {
    //A canvas que a engine vai usar
    this.canvas = aCanvas;
    //A câmera (ToyCamera).
    this.camera = new ToyCamera();
    //Função que inicia o opengl. Cria o contexto e seta a função de profundidade
    this.initOpenGL = function () {
        console.log('init opengl');
        //Cria o contexto de webgl2
        var _gl = this.canvas.getContext("webgl2");
        //Flags do contexto:
        _gl.enable(_gl.DEPTH_TEST);
        _gl.depthFunc(_gl.LESS);
        //tentativa de previnir context lost
        this.canvas.addEventListener("webglcontextlost",
            function (event) {
            event.preventDefault();
        },
            false);
        return _gl;
    };
    //Seta a viewport do opengl para o tamanho da canvas
    this.initViewport = function () {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    };
    //Tempo gasto pra renderizar
    this.tempoGasto = 0;
    //O contexto opengl 
    this.gl = this.initOpenGL();
    //cria o root
    this.root = new Toy3dObject();
    //a função de renderização. Renderiza o root e o root que se vire pra renderizar o resto.
    //Ele limpa o colobr buffer e o depth buffer, ordena a renderização do root e requisita
    //um novo quadro de animação;
    this.render = function () {
        var self = this;
        const t0 = Date.now();
        engine.gl.clearColor(0.1, 0.0, 0.1, 1.0);
        engine.gl.clear(engine.gl.COLOR_BUFFER_BIT | engine.gl.DEPTH_BUFFER_BIT);
        engine.root.render(self.gl, engine.camera, undefined);
        const t = Date.now();
        engine.tempoGasto = t - t0;
        requestAnimationFrame((ts) => {
            self.render();
        });
    };
}