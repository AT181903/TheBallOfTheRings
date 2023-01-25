export class ShadersManager {

    static vertexShaderParameters = {
        cameraPosition: [75, -75, 80],
        cameraTar: [0, 0, 20],
        cameraUp: [0, 0, 1],
        fieldOfViewDegrees: 35,
        zNear: 1,
        zFar: 2000
    }

    static fragmentShaderParameters = {
        lightDirection: [300, -300, 300],
        ambientLight: [0.2, 0.2, 0.2],
        colorLight: [1.0, 1.0, 1.0],
        shininess: 359.999993,
        opacity: 1.45,
        textureLocation: 0,
        diffuse: [0.8, 0.8, 0.8],
        ambient: [1, 1, 1],
        specular: [0.5, 0.5, 0.5],
        emissive: [0, 0, 0]
    }

    // Vertex Shader parameters

    static getCameraPosition() {
        return this.vertexShaderParameters.cameraPosition;
    }

    static increaseFieldOfViewRadiansOf(value) {
        this.vertexShaderParameters.fieldOfViewDegrees += value;
    }

    static increaseCameraPositionAtIndexOfValue(index, value) {
        this.vertexShaderParameters.cameraPosition[index] += value;
    }

    static getCameraTar() {
        return this.vertexShaderParameters.cameraTar;
    }

    static getCameraUp() {
        return this.vertexShaderParameters.cameraUp;
    }

    // View Matrix è l'inversa della Camera Matrix
    // Ed è il nuovo sistema di riferimento
    static getViewMatrix() {
        //this.move();

        let cameraMatrix = m4.lookAt(this.vertexShaderParameters.cameraPosition, this.vertexShaderParameters.cameraTar, this.vertexShaderParameters.cameraUp); //cameraMatrix = m4.lookAt((camera_override ? [camera_override.position.x, camera_override.position.z, camera_override.position.y * -1] : cameraPosition), cameraTar, up);
        return m4.inverse(cameraMatrix)
    }

    static getProjectionMatrix(canvasClientWidth, canvasClientHeight) {
        let aspect = canvasClientWidth / canvasClientHeight;

        return m4.perspective(this.degToRad(this.vertexShaderParameters.fieldOfViewDegrees), aspect, this.vertexShaderParameters.zNear, this.vertexShaderParameters.zFar);
    }

    static getLightDirection() {
        return m4.normalize(this.fragmentShaderParameters.lightDirection)
    }

    static degToRad(d) {
        return d * Math.PI / 180;
    }

    static generateGuiControls() {
        let shadersControls = new dat.GUI({
            autoPlace: false,
            width: 400
        });

        let camera = shadersControls.addFolder('Camera');

        let camera_position = camera.addFolder('Position');
        camera_position.add(this.vertexShaderParameters.cameraPosition, 0).min(0).max(75).step(1);
        camera_position.add(this.vertexShaderParameters.cameraPosition, 1).min(-75).max(15).step(1);
        camera_position.add(this.vertexShaderParameters.cameraPosition, 2).min(-200).max(200).step(1)

        camera.add(this.vertexShaderParameters, "fieldOfViewDegrees").min(30).max(60).step(1)

        let lights = shadersControls.addFolder('Lights');
        lights.add(this.fragmentShaderParameters.lightDirection, 0).min(-360).max(360).step(1);
        lights.add(this.fragmentShaderParameters.lightDirection, 1).min(-360).max(360).step(1);
        lights.add(this.fragmentShaderParameters.lightDirection, 2).min(-360).max(360).step(1);

        return shadersControls;
    }

    // Fragment Shader parameters
    static getAmbientLight(){
        return this.fragmentShaderParameters.ambientLight;
    }

    // Fragment Shader parameters
    static getColorLight(){
        return this.fragmentShaderParameters.colorLight;
    }

    static getShininess(){
        return this.fragmentShaderParameters.shininess
    }

    static getOpacity(){
        return this.fragmentShaderParameters.opacity
    }

    static getTextureLocation(){
        return this.fragmentShaderParameters.textureLocation
    }

    static getDiffuse(){
        return this.fragmentShaderParameters.diffuse
    }

    static getAmbient(){
        return this.fragmentShaderParameters.ambient
    }

    static getSpecular(){
        return this.fragmentShaderParameters.specular
    }

    static getEmissive(){
        return this.fragmentShaderParameters.emissive
    }
}