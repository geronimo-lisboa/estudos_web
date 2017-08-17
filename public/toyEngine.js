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
//O objeto 3d. Um objeto 3d tem os buffers necessários para ele existir, tem uma transformação e pode ter outros 
//objetos pendurados a ele.
function toy3dObject() {
    
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
    //a função de renderização. Renderiza o root e o root que se vire pra renderizar o resto.
    //Ele limpa o colobr buffer e o depth buffer, ordena a renderização do root e requisita
    //um novo quadro de animação;
    this.render = function () {
        const t0 = Date.now();
        engine.gl.clearColor(0.1, 0.0, 0.1, 1.0);
        engine.gl.clear(engine.gl.COLOR_BUFFER_BIT | engine.gl.DEPTH_BUFFER_BIT);
        //aqui a renderização do meu objeto
        const t = Date.now();
        engine.tempoGasto = t - t0;
        var self = this;
        requestAnimationFrame((ts) => {
            self.render();
        });
    };
}