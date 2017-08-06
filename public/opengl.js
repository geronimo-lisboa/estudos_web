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