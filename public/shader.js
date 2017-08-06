////Arquivo para as coisas relativas a shader
var vertexShaderSource =
    " precision highp float;\n" +
        "    attribute vec3 vertexPos;\n" +
        "    attribute vec4 vertexColor;\n" +
        "    uniform mat4 modelViewMatrix;\n" +
        "    uniform mat4 projectionMatrix;\n" +
        "    varying vec4 vColor;\n" +
        "    void main(void) {\n" +
        "        vColor = vertexColor;\n" +
        "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
        "            vec4(vertexPos, 1.0);\n" +
        "    }\n";
var fragmentShaderSource =
    " precision highp float;\n" +
        "varying vec4 vColor;\n" +
        "void main(void) {\n" +
        "    // Return the pixel color: always output white\n" +
        "    gl_FragColor = vColor;\n" +
        "}\n";


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
