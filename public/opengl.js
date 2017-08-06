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
