//Cria o contexto do webgl
function initWebGL(canvas) {
    var gl;
    try {
        gl = canvas.getContext("experimental-webgl");
    }
    catch (e) {
        var msg = "Erro na criação do contexto: " + e.toString();
        alert(msg);
        throw Error(msg);
    }
    return gl;
}
//Cria a viewport
function initViewport(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
}
//Usada internamente pelo initShader
function createShader(gl, str, type) {
    var shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}
//Retorna o shader program usando um vertex shader e um fragment shader com os códigos fontes 
//passados em vsSrc e fsSrc respectivamente.
function initShader(gl, vsSrc, fsSrc) {
    //Compila as partes
    var fragmentShader = createShader(gl, fsSrc, "fragment");
    var vertexShader = createShader(gl, vsSrc, "vertex");
    //linka-as
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var msg = "Falha na criação do programa";
        alert(msg);
        throw msg;
    }
    return shaderProgram;
}
//Calcula o FPS e exibe na div dada.
function showFPS(t0, t, targetDiv) {
    const fps = 1000.0 / ((t - t0) === 0 ? 1 : (t - t0));
    targetDiv.text("FPS = " + fps);
}

var projectionMatrix, modelViewMatrix;

function initMatrices() {
    // The transform matrix for the square - translate back in Z for the camera
    modelViewMatrix = new Float32Array(
        [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, -3.333, 1]);

    // The projection matrix (for a 45 degree field of view)
    projectionMatrix = new Float32Array(
        [2.41421, 0, 0, 0,
            0, 2.41421, 0, 0,
            0, 0, -1.002002, -1,
            0, 0, -0.2002002, 0]);

}